document.addEventListener('DOMContentLoaded', function() {
    // 1. 定义翻译资源
    const resources = {
        'zh': {
            translation: {
                // 导航菜单
            "language": "切换语言",
            "codeViewer": "代码孵化",
            "ETF Rank": "ETF排行榜",
            "实用搜索": "实用搜索",
            "热搜新闻": "热搜新闻",
            "学无止境": "学无止境",
            "社区资讯": "社区资讯",
            "开发生产": "开发生产",
            "开发文档": "开发文档",
            "API资源": "API资源",
            "云端服务": "云端服务",
            "实用工具": "实用工具",
            "人工智能": "人工智能",
            "在线工具": "在线工具",
            "浏览器插件": "浏览器插件",
            "虚拟信息": "虚拟信息",
            "及时行乐": "及时行乐",
            "剁手吃土": "剁手吃土",
            "文艺至死": "文艺至死",
            "动漫世界": "动漫世界",
            "直播聚合": "直播聚合",
            "影视资源": "影视资源",
            "休闲游戏": "休闲游戏",
            "音乐天堂": "音乐天堂",
            "素材资源": "素材资源",
            "音视频字体": "音视频字体",
            "壁纸下载": "壁纸下载",
            "设计灵感": "设计灵感",
            "MAC资源": "MAC资源",
            "系统相关": "系统相关",
            "系统驱动": "系统驱动",
            "配置检测": "配置检测", 
            "CPU工具": "CPU工具",
            "内存工具": "内存工具",
            "显卡工具": "显卡工具",
            "硬盘工具": "硬盘工具",
            "外设工具": "外设工具",
            "软件工具": "软件工具",
            "本站工具": "本站工具",
            "关于本站": "关于本站",
            "关于站长": "关于站长",
            
            // 搜索分类
            "常用": "常用",
            "工具": "工具",
            "生活": "生活",
            "求职": "求职",

            // 关于部分
            "about-desc": "收费网站一律不收录，嘿嘿～",
            "contact": "如书签给您造成困扰，请联系站长",
            "donate": "如本站对您有所帮助，请随意打赏，谢谢~",
            "reward": "打赏",
            "wechat": "微信",
            "alipay": "支付宝",

            // 其他UI元素
            "search-placeholder": "输入关键字搜索",
            "search-button": "搜索",
            "back-to-top": "返回顶部",
            "toggle-night": "切换夜间模式",
            "quick-search": "🔍快速定位",
            "close-search": "关闭",
            "profile-desc": "💻 代码炼金师 | 🎮 游戏探险家 | 🎬 光影捕手 \n📚 纸间收藏家 | 🌄 山野漫游者 | ⚫⚪ 黑白策士（学徒版）",
        }
    },
    "en": {
        translation: {
            // Navigation Menu
            "language": "Sw Lang",
            "codeViewer": "Code Viewer",
            "实用搜索": "Useful Search",
            "热搜新闻": "Trending News",
            "学无止境": "Learn Forever",
            "社区资讯": "Community Info",
            "开发生产": "Development",
            "开发文档": "Dev Docs",
            "API资源": "API Resources",
            "云端服务": "Cloud Services",
            "实用工具": "Useful Tools",
            "人工智能": "AI Tools",
            "在线工具": "Online Tools",
            "浏览器插件": "Browser Ext.",
            "虚拟信息": "Virtual Info",
            "及时行乐": "Entertainment",
            "剁手吃土": "Shopping",
            "文艺至死": "Art & Lit.",
            "动漫世界": "Anime World",
            "直播聚合": "Live Streaming",
            "影视资源": "Movies & TV",
            "休闲游戏": "Casual Games",
            "音乐天堂": "Music Heaven",
            "素材资源": "Resources",
            "音视频字体": "Media & Fonts",
            "壁纸下载": "Wallpapers",
            "设计灵感": "Design Inspo",
            "MAC系统": "MAC System",
            "MAC资源": "MAC Resources",
            "系统相关": "System Tools",
            "系统驱动": "System Drivers",
            "配置检测": "Config Check",
            "CPU工具": "CPU Tools",
            "内存工具": "Memory Tools",
            "显卡工具": "GPU Tools",
            "硬盘工具": "HDD Tools",
            "外设工具": "Periph. Tools",
            "软件工具": "Software Tools",
            "本站工具": "Site Tools",
            "关于本站": "About",
            "关于站长": "About Master",

            // Search Categories
            "常用": "Common",
            "工具": "Tools", 
            "生活": "Life",
            "求职": "Jobs",

            // About Section
            "about-desc": "Only free websites are included here!",
            "contact": "Contact webmaster if you have any issues",
            "donate": "If this site helps you, feel free to donate~",
            "reward": "Reward",
            "wechat": "WeChat",
            "alipay": "Alipay",

            // Other UI Elements
            "search-placeholder": "Enter keywords to search",
            "search-button": "Search",
            "back-to-top": "Back to Top",
            "toggle-night": "Toggle Night Mode",
            "quick-search": "🔍Quick Search",
            "close-search": "Close"
        }
    }
};

// 2. 初始化 i18next
i18next
    .use(i18nextBrowserLanguageDetector)
    .init({
        fallbackLng: 'zh',
        debug: true,
        resources: resources,
    }, function(err, t) {
        if (err) {
            console.error('i18next初始化失败:', err);
            return;
        }
        console.log('i18next初始化成功');
                // 根据当前语言状态为导航菜单添加初始class
                if (i18next.language === 'en') {
                    const navMenu = document.querySelector('#main-menu');
                    const subMenus = document.querySelectorAll('#main-menu ul');
                    if (navMenu) navMenu.classList.add('i18nData');
                    subMenus.forEach(menu => menu.classList.add('i18nData'));
                }
        // 初始化完成后更新页面内容
        updateContent();
    });

    // 3. 更新页面内容函数
    function updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (key) {
                if (element.tagName === 'INPUT' && element.getAttribute('placeholder')) {
                    element.placeholder = i18next.t(key);
                } else {
                    element.textContent = i18next.t(key);
                }
            }
        });
    }

    // 4. 绑定语言切换按钮点击事件
    const langBtn = document.getElementById('lang-switch-btn');
    if (langBtn) {
        langBtn.addEventListener('click', function() {
            // 获取当前语言
            const currentLang = i18next.language;
            // 切换到另一种语言
            const newLang = currentLang === 'zh' ? 'en' : 'zh';
            
            i18next.changeLanguage(newLang, (err, t) => {
                if (err) {
                    console.error('语言切换失败:', err);
                    showLanguageChangeNotification('error');
                    return;
                }
                
                // 更新页面内容
                updateContent();
                
                // 保存语言偏好到本地存储
                localStorage.setItem('i18nextLng', newLang);
                
                // 切换英文时为导航菜单增加class i18nData，切换中文时删除
                const navMenu = document.querySelector('#main-menu');
                const subMenus = document.querySelectorAll('#main-menu ul');
                if (navMenu) {
                    if (newLang === 'en') {
                        navMenu.classList.add('i18nData');
                        subMenus.forEach(menu => menu.classList.add('i18nData'));
                    } else {
                        navMenu.classList.remove('i18nData');
                        subMenus.forEach(menu => menu.classList.remove('i18nData'));
                    }
                }
                
                // 显示切换成功提示
                showLanguageChangeNotification('success', newLang);
            });
        });
    }

    // 5. 显示语言切换通知
    function showLanguageChangeNotification(type, lang) {
        if (window.iziToast) {
            if (type === 'error') {
                iziToast.error({
                    title: '×',
                    message: '语言切换失败，请刷新页面重试',
                    position: 'topRight',
                    timeout: 3000
                });
            } else {
                const message = lang === 'zh' ? '已切换到中文' : 'Switched to English';
                iziToast.success({
                    title: '✓',
                    message: message,
                    position: 'topRight',
                    timeout: 2000
                });
            }
        }
    }
});