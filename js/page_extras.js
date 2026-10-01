/**
 * ============================================================
 * 页面附加功能合集（从 index.html 内联脚本抽取）
 * ============================================================
 * 包含功能：
 *   1. window.open 全局拦截 —— 外链可访问性检测，失败跳转 404
 *   2. openLinkInSwal —— SweetAlert2 跳转确认弹窗
 *   3. 链接卡片点击次数统计与角标显示（localStorage 持久化）
 *   4. 悬浮快速定位搜索框（Ctrl+F 打开 / ESC 关闭）
 *
 * 依赖：jQuery（已在 index.html 中先于本文件引入）
 * ============================================================
 */

/* ============================================================
 * 功能 1：全局拦截 window.open，检测外链可访问性
 * 原理：同时尝试加载目标站 favicon + 发起 HEAD 请求，
 *       两者都失败（或 3 秒超时）则判定不可访问，跳转 404 页。
 * 注意：no-cors 模式下无法读取响应状态，只能判断"网络层面可达"，
 *       属于启发式检测，个别慢站可能被误判。
 * ============================================================ */
(function () {
    // 保存原生 window.open 方法
    var rawOpen = window.open;

    // 重写 window.open 方法
    window.open = function (url, target, features) {
        // 只处理 http/https 外链，其余（如锚点、相对路径）直接放行
        if (typeof url === 'string' && /^https?:\/+/.test(url)) {
            // 提取主域名（如 https://example.com）
            var match = url.match(/^(https?:\/\/[^\/]+)/);
            var domain = match ? match[1] : null;
            if (!domain) {
                return rawOpen.apply(window, arguments);
            }

            var checked = false;  // 状态标记：防止多个回调重复触发
            var timer;
            var faviconFail = false;
            var fetchFail = false;

            // 检测通过：立即打开外链
            function openNow() {
                if (checked) return;
                checked = true;
                clearTimeout(timer);
                rawOpen.call(window, url, target || '_blank', features);
            }

            // 检测失败：跳转站内 404 页面
            function failNow() {
                if (checked) return;
                checked = true;
                clearTimeout(timer);
                window.location.href = '/pages/404.html';
            }

            // 检查 A：尝试加载目标站点 favicon.ico
            var img = new Image();
            img.onload = openNow; // favicon 加载成功，说明站点可访问
            img.onerror = function () {
                faviconFail = true;
                if (fetchFail) failNow(); // favicon 与 fetch 都失败才判定不可访问
            };

            // 检查 B：对主站发起 HEAD 请求，进一步判断可访问性
            fetch(domain, { method: 'HEAD', mode: 'no-cors' })
                .then(openNow) // 请求成功（含 opaque 响应），直接放行
                .catch(function () {
                    fetchFail = true;
                    if (faviconFail) failNow();
                });

            // 超时保护：3 秒无结论则判定失败，防止长时间无响应
            timer = setTimeout(failNow, 3000);

            // 触发 favicon 检查
            img.src = domain + '/favicon.ico';
        } else {
            // 非 http/https 链接，直接调用原生 open
            return rawOpen.apply(window, arguments);
        }
    };
})();

/* ============================================================
 * 功能 2：SweetAlert2 外链跳转确认弹窗
 * @param {string} url 目标链接（确认后在当前窗口跳转）
 * ============================================================ */
function openLinkInSwal(url) {
    Swal.fire({
        title: '即将跳转',
        html: '即将打开外部链接<br><small>点击确认后将在当前窗口跳转</small>',
        showCancelButton: true,
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        showLoaderOnConfirm: true,
        allowOutsideClick: false,
        preConfirm: () => {
            window.location.href = url;
        }
    });
}

/* ============================================================
 * 功能 3：链接卡片点击次数统计与角标显示
 * 数据存储：localStorage 的 linkClickMap（{ 链接ID: 点击次数 }）
 * 链接 ID：卡片渲染时由链接 URL encode 生成（见 script_function.js）
 * ============================================================ */

// 读取指定链接的累计点击次数
function getLinkClickCount(linkId) {
    var map = JSON.parse(localStorage.getItem('linkClickMap') || '{}');
    return map[linkId] || 0;
}

// 指定链接点击次数 +1 并持久化
function setLinkClickCount(linkId) {
    var map = JSON.parse(localStorage.getItem('linkClickMap') || '{}');
    map[linkId] = (map[linkId] || 0) + 1;
    localStorage.setItem('linkClickMap', JSON.stringify(map));
}

// 刷新所有卡片的角标（先移除旧角标，再按最新次数重新渲染）
function updateAllLinkBadges() {
    $(".w-widget.box2[data-link-id]").each(function () {
        var linkId = $(this).attr('data-link-id');
        var count = getLinkClickCount(linkId);
        // 先移除所有角标，避免重复或脏数据
        $(this).find('.link-badge').remove();
        // 仅在有点击记录时显示角标
        if (count > 0) {
            $(this).append('<span class="link-badge">' + count + '</span>');
        }
    });
}

// 点击卡片时累加计数并刷新角标（事件委托，兼容动态渲染的卡片）
$(document).on('click', '.w-widget.box2[data-link-id]', function () {
    var linkId = $(this).attr('data-link-id');
    setLinkClickCount(linkId);
    updateAllLinkBadges();
});

$(function () {
    // 延迟执行，确保 links_data.json 渲染的链接卡片已插入 DOM
    setTimeout(updateAllLinkBadges, 200);
});

/* ============================================================
 * 功能 4：悬浮快速定位搜索框
 * 快捷键：Ctrl+F / Cmd+F 打开，ESC 关闭并还原列表
 * 行为：输入关键词实时筛选链接卡片，并平滑滚动到第一个匹配区块
 * ============================================================ */
$(function () {
    // 键盘快捷键
    $(document).on('keydown', function (e) {
        // Ctrl+F / Cmd+F 打开搜索框
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'f') {
            e.preventDefault();
            $('#floating-search-box').fadeIn(180);
            $('#floating-search-input').focus();
        }
        // ESC 关闭搜索框并还原筛选
        if (e.key === 'Escape') {
            if ($('#floating-search-box').is(':visible')) {
                $('#floating-search-box').fadeOut(120);
                $('#floating-search-input').val('');
                filterLinks('');
            }
        }
    });

    // 悬浮按钮点击打开搜索框
    $('#search-suspension-btn').on('click', function () {
        $('#floating-search-box').fadeIn(180);
        $('#floating-search-input').focus();
    });

    // 关闭按钮
    $('#close-search-box').on('click', function () {
        $('#floating-search-box').fadeOut(120);
        $('#floating-search-input').val('');
        filterLinks('');
    });

    // 关键词输入实时筛选
    $('#floating-search-input').on('input', function () {
        var kw = $(this).val().trim();
        filterLinks(kw);
    });

    /**
     * 按关键词筛选所有链接卡片
     * @param {string} keyword 关键词（空字符串表示还原全部）
     */
    function filterLinks(keyword) {
        try {
            var firstVisible = null;
            var kwLower = keyword.toLowerCase();
            // 遍历所有链接分区（id 以 section- 开头的 row 容器）
            $("div.row[id^='section-']").each(function () {
                var $row = $(this);
                var hasVisible = false;
                // 逐卡片匹配：模糊匹配 + 大小写不敏感
                $row.children().each(function () {
                    var $item = $(this);
                    var text = $item.text() || '';
                    if (!keyword || text.toLowerCase().indexOf(kwLower) !== -1) {
                        $item.show();
                        hasVisible = true;
                    } else {
                        $item.hide();
                    }
                });
                // 同步控制分区标题 <h6 class="tag"> 的显隐
                var $tag = $row.prevAll('h6.tag').first();
                if (hasVisible) {
                    $row.show();
                    $tag.css('display', '');
                    if (!firstVisible) firstVisible = $tag.length ? $tag : $row;
                } else {
                    $row.hide();
                    $tag.css('display', 'none');
                }
            });
            // 滚动到第一个匹配的搜索结果区块
            scrollToSearchResult(keyword, firstVisible);
        } catch (e) {
            console.error('筛选异常:', e);
        }
    }

    /**
     * 平滑滚动到第一个匹配的搜索结果区块
     * @param {string} keyword      关键词（为空时不滚动）
     * @param {jQuery} firstVisible 第一个可见区块元素
     */
    function scrollToSearchResult(keyword, firstVisible) {
        if (keyword && firstVisible && firstVisible.length) {
            $('html,body').animate({ scrollTop: firstVisible.offset().top - 60 }, 350);
        }
    }

    // 根据夜间模式同步搜索框背景色
    function updateSearchBoxBg() {
        if ($('body').hasClass('night')) {
            $('#floating-search-box').css('background', 'rgba(30,32,40,0.98)');
        } else {
            $('#floating-search-box').css('background', 'rgba(255,255,255,0.95)');
        }
    }
    updateSearchBoxBg();

    // 监听 body class 变化（夜间模式切换时自动更新背景色）
    const observer = new MutationObserver(updateSearchBoxBg);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
});
