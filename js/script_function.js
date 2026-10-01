/**
 * ============================================================
 * 搜索框核心逻辑（原 eval 混淆代码还原重写，功能不变）
 * ============================================================
 * 功能：
 *   1. 记住用户选择的搜索引擎（localStorage 持久化）
 *   2. 记住「新窗口打开」开关状态
 *   3. 切换引擎时同步搜索框 placeholder 和当前分组高亮
 *   4. 提交时拼接搜索 URL 并跳转（新窗口或当前窗口）
 *
 * 说明：搜索建议（联想词）逻辑在 js/search_suggestion.js 中，
 *       联想词选中后会直接填入输入框，此处提交时直接读取即可。
 * ============================================================
 */
(function () {
    "use strict";

    // ===== DOM 元素 =====
    var typeInputs    = document.querySelectorAll('input[name="type"]'); // 所有搜索引擎单选框
    var searchForm    = document.querySelector('#super-search-fm');      // 搜索表单
    var searchInput   = document.querySelector('#search-text');          // 关键词输入框
    var blankCheckbox = document.querySelector('#set-search-blank');     // 「新窗口打开」开关
    var searchGroups  = document.querySelectorAll('.search-group');      // 搜索引擎分组（用于高亮）

    // ===== localStorage 读写工具（键名带 superSearch 前缀） =====
    function saveSetting(key, value) {
        localStorage.setItem('superSearch' + key, value);
    }
    function readSetting(key) {
        return localStorage.getItem('superSearch' + key);
    }

    // ===== 状态读取 =====
    /** 当前选中的搜索引擎 input */
    function getCheckedInput() {
        return document.querySelector('input[name="type"]:checked');
    }
    /** 当前选中引擎的搜索 URL 前缀 */
    function getSearchUrl() {
        return getCheckedInput().value;
    }
    /** 当前选中引擎的提示语 */
    function getPlaceholder() {
        return getCheckedInput().getAttribute('data-placeholder');
    }
    /** 是否新窗口打开（默认 true） */
    function isNewWindow() {
        var stored = readSetting('NewWindow');
        return stored ? stored === '1' : true;
    }
    /** 记住的引擎 value（无记录时取第一个引擎） */
    function getSavedType() {
        var saved = readSetting('Type');
        return saved || typeInputs[0].value;
    }

    // ===== 视图更新 =====
    /** 更新表单 target（新窗口/当前窗口） */
    function updateFormTarget(newWindow) {
        if (newWindow) {
            searchForm.target = '_blank';
        } else {
            searchForm.removeAttribute('target');
        }
    }
    /** 高亮当前选中引擎所在的分组 */
    function highlightGroup(input) {
        for (var i = 0; i < searchGroups.length; i++) {
            searchGroups[i].classList.remove('s-current');
        }
        input.parentNode.parentNode.parentNode.classList.add('s-current');
    }

    // ===== 事件处理 =====
    /** 切换搜索引擎 */
    function onTypeChange(e) {
        var input = e.target;
        searchInput.setAttribute('placeholder', getPlaceholder());
        searchForm.action = input.value;
        saveSetting('Type', input.value);
        searchInput.focus();
        highlightGroup(input);
    }

    /** 切换「新窗口打开」开关 */
    function onBlankChange(e) {
        saveSetting('NewWindow', e.target.checked ? 1 : -1);
        updateFormTarget(e.target.checked);
    }

    /** 提交搜索：拼接 URL 并跳转 */
    function onSubmit(e) {
        e.preventDefault();
        var query = searchInput.value;
        if (query === '') {
            searchInput.focus();
            return false;
        }
        var url = getSearchUrl() + query;
        searchForm.action = url;
        updateFormTarget(isNewWindow());
        if (isNewWindow()) {
            // 第二个参数使用时间戳，避免同名窗口被复用
            window.open(url, +new Date());
        } else {
            window.location.href = url;
        }
    }

    // ===== 初始化 =====
    function init() {
        // 恢复「新窗口打开」开关状态
        blankCheckbox.checked = isNewWindow();
        // 恢复上次选择的搜索引擎
        var savedInput = document.querySelector('input[name="type"][value="' + getSavedType() + '"]');
        if (savedInput) {
            savedInput.checked = true;
            highlightGroup(savedInput);
        }
        // 恢复 placeholder 与表单 action
        searchInput.setAttribute('placeholder', getPlaceholder());
        searchForm.action = getSearchUrl();
    }

    // ===== 绑定事件 =====
    init();
    for (var i = 0; i < typeInputs.length; i++) {
        typeInputs[i].addEventListener('change', onTypeChange);
    }
    blankCheckbox.addEventListener('change', onBlankChange);
    searchForm.addEventListener('submit', onSubmit);
})();


//回到顶部（使用 requestAnimationFrame 节流，避免 scroll 事件高频触发造成性能损耗）
var scrollTicking = false;
$(window).scroll(function () {
    if (scrollTicking) return;
    scrollTicking = true;
    window.requestAnimationFrame(function () {
        if ($(window).scrollTop() >= 50) {
            $('#topup').fadeIn(200);
            $('.sidebar-menu').addClass('bgchange');
        } else {
            $('#topup').fadeOut(200);
            $('.sidebar-menu').removeClass('bgchange');
        }
        scrollTicking = false;
    });
});
$('a[rel="go-top"]').click(function () {
    window.scrollTo(0, 0);
});

//鼠标样式
const body = document.querySelector("body");
const element = document.getElementById("pointer");
const halfElementWidth = element.offsetWidth / 2;

function setPosition(x, y) {
    element.style.transform = `translate(${x - halfElementWidth + 19}px, ${y - halfElementWidth + 19}px)`;
}

// 监听鼠标移动，更新指针位置
body.addEventListener("mousemove", (e) => {
    window.requestAnimationFrame(() => setPosition(e.clientX, e.clientY));
});

//非桌面端去除鼠标样式
if (/Mobi|Tablet|iPad|iPhone|Android/i.test(navigator.userAgent)) {
    $('#pointer').css("display", "none");
}

// 从 localStorage 获取指定键名的值
const getStorage = (key) => localStorage.getItem(key);

// 向 localStorage 设置指定键名和值
const setStorage = (key, value) => localStorage.setItem(key, value);

// 设置夜间模式或日间模式
const setNightMode = (enable) => {
    if (enable) {
        // 启用夜间模式
        document.body.classList.add('night');
        setStorage('night', '1'); // 记录为夜间模式
        document.getElementById('suspension_text').innerText = '切换日间模式';
        iziToast.info({
            timeout: 2000,
            closeOnEscape: true,
            transitionOut: 'fadeOutRight',
            displayMode: 'replace',
            layout: 2,
            transitionIn: 'bounceInLeft',
            position: 'topRight',
            icon: 'ti ti-moon-filled',
            backgroundColor: '#fff',
            title: '夜间模式切换',
            message: '已切换为夜间模式'
        });
    } else {
        // 启用日间模式
        document.body.classList.remove('night');
        setStorage('night', '0'); // 记录为日间模式
        document.getElementById('suspension_text').innerText = '切换夜间模式';
        iziToast.info({
            timeout: 2000,
            closeOnEscape: true,
            transitionOut: 'fadeOutRight',
            displayMode: 'replace',
            layout: 2,
            transitionIn: 'bounceInLeft',
            position: 'topRight',
            icon: 'ti ti-sun-filled',
            backgroundColor: '#fff',
            title: '日间模式切换',
            message: '已切换为日间模式'
        });
    }
};

// 切换当前模式：夜间 -> 日间，日间 -> 夜间
const switchNightMode = () => {
    const night = getStorage('night') || '0'; // 默认为日间模式（0）
    setNightMode(night === '0');
};

// 判断当前时间是否属于夜间时间段（19点后或凌晨7点前）
const isNightTime = () => {
    const hour = new Date().getHours();
    return hour > 18 || hour < 7;
};

// 监听系统配色方案变化（比如 Windows、Mac 自动切换暗色模式）
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
    setNightMode(event.matches);
});

// 页面首次加载时，根据 localStorage 或时间设置初始模式
(() => {
    const night = getStorage('night');
    if (night === null) {
        // 如果没有存储记录，根据当前时间自动切换
        setNightMode(isNightTime());
    } else {
        // 如果有记录，按记录来
        setNightMode(night === '1');
    }
})();

// 星空背景动画
function stars() {
    const canvas = document.getElementById("starfield"); // 获取画布元素
    const ctx = canvas.getContext("2d"); // 获取2D绘图上下文
    let width = window.innerWidth; // 当前窗口宽度
    let height = window.innerHeight; // 当前窗口高度
    let stars = []; // 存放所有星星对象
    let initialBurst = true; // 初始阶段，是否让流星出现更多
    // 根据屏幕宽度决定星星数量，并设置上限 400，避免宽屏设备粒子过多造成掉帧
    const STAR_COUNT = Math.min(Math.floor(0.3 * width), 400);
  
    // 定义星星、巨星、流星的颜色（RGB）
    const COLORS = {
      giant: "180,184,240", // 巨星：蓝白色
      star: "226,225,142",  // 普通星星：黄色
      comet: "225,225,225"  // 流星：白色
    };
  
    // 定义星星类
    class Star {
      constructor() {
        this.reset(); // 初始化星星属性
      }
  
      // 初始化或重置星星属性
      reset() {
        this.isGiant = randomChance(3); // 3%的概率是巨星
        this.isComet = !this.isGiant && !initialBurst && randomChance(20); // 初期流星多，之后减少
        this.x = randomRange(0, width); // 随机x位置
        this.y = randomRange(0, height); // 随机y位置
        this.size = randomRange(1.1, 2.6); // 星星尺寸
        // 水平和垂直移动速度（流星速度更快）
        this.dx = randomRange(0.05, 0.3) + (this.isComet ? randomRange(2.5, 6) : 0.05);
        this.dy = -randomRange(0.05, 0.3) - (this.isComet ? randomRange(2.5, 6) : 0.05);
        this.opacity = 0; // 当前透明度
        this.opacityTarget = randomRange(0.6, this.isComet ? 0.8 : 1); // 目标透明度
        this.fadeSpeed = randomRange(0.0005, 0.002) + (this.isComet ? 0.001 : 0); // 渐变速度
        this.fadingIn = true; // 是否处于淡入阶段
        this.fadingOut = false; // 是否处于淡出阶段
      }
  
      // 处理星星淡入效果
      fadeIn() {
        if (this.fadingIn) {
          this.opacity += this.fadeSpeed;
          if (this.opacity >= this.opacityTarget) {
            this.fadingIn = false; // 达到目标透明度后停止淡入
          }
        }
      }
  
      // 处理星星淡出效果
      fadeOut() {
        if (this.fadingOut) {
          this.opacity -= this.fadeSpeed / 2;
          if (this.opacity <= 0) {
            this.reset(); // 透明度降到0后，重置星星
          }
        }
      }
  
      // 更新星星的位置
      move() {
        this.x += this.dx;
        this.y += this.dy;
        // 如果星星移动到屏幕边缘，开始淡出
        if (!this.fadingOut && (this.x > width - width / 4 || this.y < 0)) {
          this.fadingOut = true;
        }
      }
  
      // 绘制星星
      draw() {
        ctx.beginPath();
        if (this.isGiant) {
          // 绘制巨星（大圆）
          ctx.fillStyle = `rgba(${COLORS.giant},${this.opacity})`;
          ctx.arc(this.x, this.y, 2, 0, 2 * Math.PI);
        } else if (this.isComet) {
          // 绘制流星（小圆+拖尾）
          ctx.fillStyle = `rgba(${COLORS.comet},${this.opacity})`;
          ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI);
          // 绘制流星的尾巴（多个小矩形）
          for (let i = 0; i < 30; i++) {
            ctx.fillStyle = `rgba(${COLORS.comet},${this.opacity - this.opacity / 20 * i})`;
            ctx.fillRect(this.x - this.dx / 4 * i, this.y - this.dy / 4 * i - 2, 2, 2);
          }
        } else {
          // 绘制普通星星（小方块）
          ctx.fillStyle = `rgba(${COLORS.star},${this.opacity})`;
          ctx.fillRect(this.x, this.y, this.size, this.size);
        }
        ctx.closePath();
        ctx.fill();
      }
    }
  
    // 工具函数：按概率返回true
    function randomChance(percent) {
      return Math.random() * 1000 < percent * 10;
    }
  
    // 工具函数：返回[min, max]范围内的随机数
    function randomRange(min, max) {
      return Math.random() * (max - min) + min;
    }
  
    // 根据窗口尺寸调整画布大小
    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.setAttribute("width", width);
      canvas.setAttribute("height", height);
    }
  
    // 更新所有星星：移动+透明度变化+绘制
    function update() {
      ctx.clearRect(0, 0, width, height); // 清空画布
      for (let star of stars) {
        star.move();
        star.fadeIn();
        star.fadeOut();
        star.draw();
      }
      requestAnimationFrame(update); // 下一帧继续
    }
  
    // 初始化函数
    function init() {
      resizeCanvas(); // 初始设置画布大小
      stars = Array.from({ length: STAR_COUNT }, () => new Star()); // 创建所有星星
      update(); // 启动动画
      setTimeout(() => initialBurst = false, 50); // 50ms后关闭初始爆发
    }
  
    // 监听窗口尺寸变化，重新调整画布大小（防抖 200ms，避免拖拽窗口时频繁重排）
    let resizeTimer = null;
    window.addEventListener("resize", function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeCanvas, 200);
    });
  
    // 执行初始化
    init();
}
  
// 调用stars函数，启动星空背景
stars();

//背景图片加载失败，设置背景纯色
document.addEventListener('DOMContentLoaded', function() {
    // 获取背景图片URL
    const body = document.querySelector('body');
    const bgUrl = window.getComputedStyle(body).backgroundImage.slice(4, -1).replace(/"/g, "");
    
    // 创建一个临时图片元素来测试加载
    const img = new Image();
    img.src = bgUrl;
    
    img.onload = function() {
        // 图片加载成功，不做任何操作
        console.log('背景图片加载成功');
    };
    
    img.onerror = function() {
        // 图片加载失败，设置背景纯色
        body.style.background = '#3f5d5c';
        body.style.backgroundImage = 'none'; // 移除失败的背景图片
        console.log('背景图片加载失败，已设置为纯色背景');
    };
});

//侧边栏菜单键
// ========== 定义公共变量 ==========
var public_vars = public_vars || {};

// ========== 页面初始化 ==========
;(function($, window, undefined) {
    "use strict";

    $(document).ready(function() {
        // 缓存常用元素
        public_vars.$body           = $("body");
        public_vars.$pageContainer  = public_vars.$body.find(".page-container");
        public_vars.$sidebarMenu    = public_vars.$pageContainer.find('.sidebar-menu');
        public_vars.$mainMenu       = public_vars.$sidebarMenu.find('.main-menu');
        public_vars.$mainContent    = public_vars.$pageContainer.find('.main-content');
        public_vars.$mainFooter     = public_vars.$body.find('footer.main-footer');
        public_vars.$userInfoMenu   = public_vars.$body.find('nav.navbar.user-info-navbar');
        public_vars.wheelPropagation = true; // 主菜单滚轮传播开关

        // 初始化侧边栏菜单
        setup_sidebar_menu();

        // 设置用户信息菜单各项高度一致
        if (public_vars.$userInfoMenu.length) {
            public_vars.$userInfoMenu.find('.user-info-menu > li').css({
                minHeight: public_vars.$userInfoMenu.outerHeight() - 1
            });
        }
    });

})(jQuery, window);

// ========== 侧边栏菜单初始化 ==========
var sm_duration = 0.2, // 子菜单动画时长（秒）
    sm_transition_delay = 150; // 子菜单动画延迟（毫秒）

function setup_sidebar_menu() {
    if (!public_vars.$sidebarMenu.length) return;

    var $items_with_subs = public_vars.$sidebarMenu.find('li:has(> ul)'),
        toggle_others = public_vars.$sidebarMenu.hasClass('toggle-others');

    // 默认展开 active 菜单
    $items_with_subs.filter('.active').addClass('expanded');

    $items_with_subs.each(function() {
        var $li = $(this),
            $a = $li.children('a'),
            $sub = $li.children('ul');

        $li.addClass('has-sub');

        $a.on('click', function(e) {
            e.preventDefault();

            if (toggle_others) {
                sidebar_menu_close_items_siblings($li);
            }

            if ($li.hasClass('expanded') || $li.hasClass('opened')) {
                sidebar_menu_item_collapse($li, $sub);
            } else {
                sidebar_menu_item_expand($li, $sub);
            }
        });
    });
}

// ========== 展开子菜单 ==========
function sidebar_menu_item_expand($li, $sub) {
    if ($li.data('is-busy') || ($li.parent('.main-menu').length && public_vars.$sidebarMenu.hasClass('collapsed'))) {
        return;
    }

    $li.addClass('expanded').data('is-busy', true);
    $sub.show();

    var $sub_items = $sub.children(),
        sub_height = $sub.outerHeight();

    // 初始化子项动画状态
    $sub_items.addClass('is-hidden');
    $sub.height(0);

    // 使用 GSAP 执行动画展开
    gsap.to($sub, {
        duration: sm_duration,
        height: sub_height,
        onComplete: () => $sub.height('')
    });

    // 清除之前定时器
    clearTimeout($li.data('sub_i_1'));
    clearTimeout($li.data('sub_i_2'));

    // 设置新定时器
    var interval_1 = setTimeout(() => {
        $sub_items.each((i, el) => $(el).addClass('is-shown'));

        // 计算 transition 结束时间
        var t_duration = parseFloat($sub_items.eq(0).css('transition-duration')) || 0,
            t_delay = parseFloat($sub_items.last().css('transition-delay')) || 0,
            finish_time = (t_duration + t_delay) * 1000 || sm_transition_delay * $sub_items.length;

        var interval_2 = setTimeout(() => {
            $sub_items.removeClass('is-hidden is-shown');
        }, finish_time);

        $li.data('sub_i_2', interval_2);
        $li.data('is-busy', false);
    }, 0);

    $li.data('sub_i_1', interval_1);
}

// ========== 收起子菜单 ==========
function sidebar_menu_item_collapse($li, $sub) {
    if ($li.data('is-busy')) return;

    var $sub_items = $sub.children();

    $li.removeClass('expanded').data('is-busy', true);
    $sub_items.addClass('hidden-item');

    gsap.to($sub, {
        duration: sm_duration,
        height: 0,
        onComplete: () => {
            $li.data('is-busy', false).removeClass('opened');
            $sub.attr('style', '').hide();
            $sub_items.removeClass('hidden-item');
            $li.find('li.expanded ul').attr('style', '').hide().parent().removeClass('expanded');
        }
    });
}

// ========== 关闭同级菜单 ==========
function sidebar_menu_close_items_siblings($li) {
    $li.siblings('.expanded, .opened').each(function() {
        var $_li = $(this),
            $_sub = $_li.children('ul');

        sidebar_menu_item_collapse($_li, $_sub);
    });
}

// ========== 侧边栏、移动端菜单开关 ==========
;(function($, window, undefined) {
    "use strict";

    $(document).ready(function() {
        // 侧边栏折叠按钮
        $('a[data-toggle="sidebar"]').on('click', function(e) {
            e.preventDefault();
            public_vars.$sidebarMenu.toggleClass('collapsed');
        });

        // 移动端主菜单按钮
        $('a[data-toggle="mobile-menu"]').on('click', function(e) {
            e.preventDefault();
            public_vars.$mainMenu.toggleClass('mobile-is-visible');
            public_vars.$sidebarMenu.toggleClass('mobile-is-visible');
            public_vars.$pageContainer.toggleClass('mobile-is-visible');
        });

        // 移动端用户信息菜单按钮
        $('a[data-toggle="user-info-menu"]').on('click', function(e) {
            e.preventDefault();
            public_vars.$userInfoMenu.toggleClass('mobile-is-visible');
        });
    });

})(jQuery, window);

// ========== 页面交互功能 ==========
$(document).ready(function() {
    // 图片懒加载
    lozad().observe();

    // 点击展开子菜单时收起其他菜单
    $(document).on("click", ".has-sub", function() {
        var $this = $(this);
        if ($this.hasClass("expanded")) {
            $(".has-sub ul").not($this.find("ul")).removeAttr("style");
        } else {
            $this.find("ul").removeAttr("style");
        }
    });

    // 切换侧边栏时处理子菜单展开状态
    $(".user-info-menu .d-none").on("click", function() {
        if ($(".sidebar-menu").hasClass("collapsed")) {
            $(".has-sub.expanded > ul").removeAttr("style");
        } else {
            $(".has-sub.expanded > ul").show();
        }
    });

    // 二级菜单选中切换
    $("#main-menu li ul li").on("click", function() {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
    });

    // 平滑滚动并切换选中状态
    $("a.smooth").on("click", function(e) {
        e.preventDefault();

        var targetId = $(this).attr("href"),
            targetOffset = $(targetId).offset().top - 30;

        $("#main-menu li").removeClass("active");
        $(this).parent("li").addClass("active");

        // 隐藏移动端菜单
        public_vars.$mainMenu.removeClass("mobile-is-visible");
        public_vars.$sidebarMenu.removeClass("mobile-is-visible");
        public_vars.$pageContainer.removeClass("mobile-is-visible");

        window.scrollTo({ top: targetOffset, behavior: "smooth" });
    });
});

/**
 * 图片加载失败时的兜底处理
 * @param {HTMLImageElement} img 触发错误的图片元素（通过 onerror="imgerrorfun(this)" 传入）
 * 修复：原代码依赖全局 event 对象（event.srcElement），Firefox 下不兼容会报错
 */
function imgerrorfun(img) {
    img.src = '/images/browser.svg'; // 替换为默认占位图
    img.onerror = null; // 置空回调，避免占位图也加载失败时无限循环
} 

// 获取所有带有 data-bs-toggle="tooltip" 的元素，转换为数组
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));

// 遍历这些元素，为每个元素创建一个 Bootstrap Tooltip 实例
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

// 全局变量定义
var public_vars = public_vars || {};

jQuery.extend(public_vars, {
    breakpoints: {
        largescreen: [991, -1],
        tabletscreen: [768, 990],
        devicescreen: [420, 767],
        sdevicescreen: [0, 419]
    },
    lastBreakpoint: null
});

// 主响应函数：根据断点执行逻辑
function resizable(breakpoint) {
    switch (breakpoint) {
        case 'largescreen':
            // 可放大屏专用逻辑
            public_vars.$sidebarMenu.removeClass('collapsed');
            break;
        case 'tabletscreen':
            // 平板屏幕时折叠菜单
            public_vars.$sidebarMenu.addClass('collapsed');
            break;
        case 'devicescreen':
        case 'sdevicescreen':
            // 移动端逻辑
            break;
    }
}

// 获取当前断点
function get_current_breakpoint() {
    const width = jQuery(window).width();
    const breakpoints = public_vars.breakpoints;

    for (const label in breakpoints) {
        let [min, max] = breakpoints[label];
        if (max === -1) max = Infinity;

        if (width >= min && width <= max) {
            return label;
        }
    }

    return null;
}

// 判断是否处于某个断点
function is(screen_label) {
    return get_current_breakpoint() === screen_label;
}

// 是否是超小屏（手机类）
function isxs() {
    return is('devicescreen') || is('sdevicescreen');
}

// 是否是平板及以上
function ismdxl() {
    return is('tabletscreen') || is('largescreen');
}

// 响应断点变化触发函数
function trigger_resizable() {
    const currentBreakpoint = get_current_breakpoint();

    if (public_vars.lastBreakpoint !== currentBreakpoint) {
        public_vars.lastBreakpoint = currentBreakpoint;
        resizable(currentBreakpoint);
    }
}

// 添加窗口尺寸变化监听
jQuery(window).on('resize orientationchange', trigger_resizable);


// 初始化
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(times, 1000);        // 获取当前时间并显示
    fetchDongManData();             // 获取动漫经典语录数据
    fetchEnglishData();             // 获取励志英语数据
});


// NOTE: 原 fetchWeatherData()（通过 IP 获取天气的旧实现）已删除——
//       功能已被 js/qweather.js（和风天气 API）完全取代，
//       且其依赖的 http://ipwho.is 在 HTTPS 页面下会被浏览器拦截（混合内容问题）。

// NOTE: 获取动漫经典语录数据
function fetchDongManData() {
    fetch('https://api.vvhan.com/api/ian/dongman?type=json')
        .then(response => {
            // 检查响应内容类型
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json(); // 如果是 JSON，正常解析
            } else {
                return response.text(); // 否则按文本处理
            }
        })
        .then(data => {
            var anime_text = data.data.content + " ——《 " + data.data.form + " 》";
            // 显示到 <p id="anime_text"></p> 并美化样式
            var textP = document.getElementById('anime_text');
            if (textP) {
                textP.innerHTML = anime_text;
                textP.style.fontSize = '18px';
                textP.style.fontWeight = 'bold';
                textP.style.textAlign = 'center';
                textP.style.margin = '10px 0 10px 0';
                textP.style.lineHeight = '1.6';
                textP.style.fontFamily = 'LXGW WenKai, "微软雅黑", "Arial", sans-serif';
                textP.style.textShadow = '0 2px 8px rgba(33,150,243,0.15)';
            }
        })
        // API 故障时静默降级，避免产生未捕获的 Promise 报错
        .catch(error => console.warn('动漫语录加载失败:', error));
}

// NOTE: 获取励志英语数据
function fetchEnglishData() {
    fetch('https://api.vvhan.com/api/dailyEnglish?type=sj')
        .then(response => response.json())
        .then(data => {
            var english_text = data.data.en + " ——" + data.data.zh;
            var textP = document.getElementById('english_text');
            if (textP) {
                textP.innerHTML = english_text;
                textP.style.fontSize = '18px';
                textP.style.fontWeight = 'bold';
                textP.style.textAlign = 'center';
                textP.style.margin = '10px 0 10px 0';
                textP.style.lineHeight = '1.6';
                textP.style.fontFamily = 'LXGW ZhenKai, "微软雅黑", "Arial", sans-serif';
                textP.style.textShadow = '0 2px 8px rgba(33,150,243,0.15)';
            }
        })
        // API 故障时静默降级，避免产生未捕获的 Promise 报错
        .catch(error => console.warn('励志英语加载失败:', error));
}

// NOTE: 获取当前时间并显示（每秒递归调用自身刷新）
function times() {
    // 修复：原代码 dt 未声明导致隐式全局变量，且存在无效的 clearTimeout(null)
    const dt = new Date();
    let y = dt.getYear() + 1900;
    let mm = dt.getMonth() + 1;
    let d = dt.getDate();
    let weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    let day = dt.getDay();
    let h = dt.getHours();
    let m = dt.getMinutes();
    let s = dt.getSeconds();
    if (h < 10) {
        h = "0" + h;
    }
    if (m < 10) {
        m = "0" + m;
    }
    if (s < 10) {
        s = "0" + s;
    }
    $("#times").html(y + "." + mm + "." + d + "&nbsp;" + "<span class='weekday'>" + weekday[day] + "</span><br>" + "<span class='time-text'>" + h + ":" + m + ":" + s + "</span>");
    setTimeout(times, 1000);
}


// NOTE: 弹出层控制
function openSwalBox(url,title){
    console.log("url:", url);
    Swal.fire({
        title: title,
        html: '<iframe src="'+ url +'" style="width:100%; height:700px; border:none;"></iframe>',
        customClass: {
            popup: 'embed-iframe-theme' // 使用 embed-iframe 主题（需引入对应 CSS）
        },
        showCloseButton: true,
        showConfirmButton: false,
        width: '1300px',
        allowOutsideClick: true
    });
}

// XXX: 工具
fetch('/json/utils_data.json')               // 1. 发起请求
    .then(response => response.json())    // 2. 解析响应为 JSON
    .then(data => {                       // 3. 使用解析后的数据
        //console.log(data);                  // 4. 打印数据
                                            // 5. 打印网页
        const toolList = document.getElementById('tool-list');
        toolList.innerHTML = data.map(tool => `
            <a onclick="openSwalBox('${tool.url}','${tool.title}')" href="javascript:void(0);" class="tool-card visible" data-category="${tool.dataCategory}">
                <div class="icon-wrapper">
                    <div class="icon-bg"></div>
                    <i class="${tool.icon}" style="${tool.iconColor}"></i>
                </div>
                <h3>${tool.title}</h3>
                <p class="card-description">${tool.desc}</p>
                <span class="category-tag">${tool.category}</span>
                ${tool.featured ? '<span class="featured-indicator"><i class="fas fa-star"></i>热门</span>' : ''}
            </a>
        `).join('');
    })
    .catch(error => {                 // 6. 处理错误
        console.error('utils_data.json 加载 JSON 失败:', error);
    });


// XXX: 链接
fetch('/json/links_data.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(section => {
            const row = document.getElementById('section-' + section.section);
            if (!row) return;
            row.innerHTML = section.links.map(link => {
                const linkId = encodeURIComponent(link.url);// 使用链接的 url 作为唯一 id，避免重复，用于数字角标功能
                return `
                <div class="col-6 col-sm-6 col-md-4 col-lg-3 col-xl-2w col-xxl-2">
                    <div class="w-widget box2"
                        onclick="window.open('${link.url}', '_blank')" data-bs-toggle="tooltip"
                        data-bs-placement="bottom" title="${link.desc}" rel="noopener noreferrer" data-link-id="${linkId}">
                        <div class="w-comment-entry">
                            <a>
                                <img data-src="${link.icon}" 
                                class="lozad img-circle" onerror="imgerrorfun(this)">
                            </a>
                            <div class="w-comment">
                                <a class="overflowClip_1"><strong>${link.title}</strong></a>
                                <p class="overflowClip_2">${link.desc}</p>
                            </div>
                        </div>
                    </div>
                </div>
                `;
            }).join('');

            // 图片是动态生成的（如通过 AJAX/Fetch 加载），需要在内容插入 DOM 后，重新初始化懒加载
            lozad('.lozad').observe();
        });
    })
    .catch(error => {                 // 6. 处理错误
        console.error('links_data.json 加载 JSON 失败:', error);
    });


// NOTE: 脚注——页面加载耗时
$(document).ready(function () {
    var t1 = performance.now();
    if (typeof t1 != "undefined") { document.getElementById("time").innerHTML = " 页面加载耗时 " + Math.round(t1) + " 毫秒 "; }
});
// NOTE: 原 $.get("/cdn-cgi/trace") 访客信息展示已删除——
//       该接口是 Cloudflare 专有功能，本站部署在 GitHub Pages，
//       请求返回 404 HTML，正则 match 结果为 null 会直接抛出 TypeError。


// INFO: 控制台输出（已移除 console.clear()，避免抹掉调试有用的报错信息）
let styleTitle1 = `
font-size: 20px;
font-weight: 600;
color: rgba(89, 244, 102, 1);
`
let styleTitle2 = `
font-size: 16px;
color: rgb(244,167,89);
`
let styleContent = `
color: rgb(30,152,255);
`
let title1 = 'Astral Nav'
let title2 = `

`
let content = `
版 本 号：v1.3.9
更新日期：2025-07-24

Github:  https://github.com/killhub/
`
console.log(`%c${title1} %c${title2}
%c${content}`, styleTitle1, styleTitle2, styleContent)