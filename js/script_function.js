//搜索框
eval(function (e, t, a, c, i, n) {
    if (i = function (e) {
        return (e < t ? "" : i(parseInt(e / t))) + (35 < (e %= t) ? String.fromCharCode(e + 29) : e.toString(
            36))
        }, !"".replace(/^/, String)) {
        for (; a--;) n[i(a)] = c[a] || i(a);
        c = [function (e) {
        return n[e]
        }], i = function () {
        return "\\w+"
        }, a = 1
    }
    for (; a--;) c[a] && (e = e.replace(new RegExp("\\b" + i(a) + "\\b", "g"), c[a]));
    return e
    }('!2(){2 g(){h(),i(),j(),k()}2 h(){d.9=s()}2 i(){z a=4.8(\'A[B="7"][5="\'+p()+\'"]\');a&&(a.9=!0,l(a))}2 j(){v(u())}2 k(){w(t())}2 l(a){P(z b=0;b<e.O;b++)e[b].I.1c("s-M");a.F.F.F.I.V("s-M")}2 m(a,b){E.H.S("L"+a,b)}2 n(a){6 E.H.Y("L"+a)}2 o(a){f=a.3,v(u()),w(a.3.5),m("7",a.3.5),c.K(),l(a.3)}2 p(){z b=n("7");6 b||a[0].5}2 q(a){m("J",a.3.9?1:-1),x(a.3.9)}2 r(a){6 a.11(),""==c.5?(c.K(),!1):(w(t()+c.5),x(s()),s()?E.U(b.G,+T X):13.Z=b.G,10 0)}2 s(){z a=n("J");6 a?1==a:!0}2 t(){6 4.8(\'A[B="7"]:9\').5}2 u(){6 4.8(\'A[B="7"]:9\').W("14-N")}2 v(a){c.1e("N",a)}2 w(a){b.G=a}2 x(a){a?b.3="1a":b.16("3")}z y,a=4.R(\'A[B="7"]\'),b=4.8("#18-C-19"),c=4.8("#C-12"),d=4.8("#17-C-15"),e=4.R(".C-1b"),f=a[0];P(g(),y=0;y<a.O;y++)a[y].D("Q",o);d.D("Q",q),b.D("1d",r)}();',
    62, 77,
    "||function|target|document|value|return|type|querySelector|checked||||||||||||||||||||||||||var|input|name|search|addEventListener|window|parentNode|action|localStorage|classList|newWindow|focus|superSearch|current|placeholder|length|for|change|querySelectorAll|setItem|new|open|add|getAttribute|Date|getItem|href|void|preventDefault|text|location|data|blank|removeAttribute|set|super|fm|_blank|group|remove|submit|setAttribute"
    .split("|"), 0, {})
);

//回到顶部
$(window).scroll(function () {
    if ($(this).scrollTop() >= 50) {
        $('#topup').fadeIn(200);
        $('.sidebar-menu').addClass('bgchange');
    } else {
        $('#topup').fadeOut(200);
        $('.sidebar-menu').removeClass('bgchange');
    }
});
$('a[rel="go-top"]').click(function () {
    window.scrollTo(0,0)
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
    const STAR_COUNT = Math.floor(0.3 * width); // 根据屏幕宽度决定星星数量
  
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
  
    // 监听窗口尺寸变化，重新调整画布大小
    window.addEventListener("resize", resizeCanvas);
  
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

function imgerrorfun(){  
    const img = event.srcElement; // 获取触发错误的图片元素
    img.src = '/images/browser.svg'; // 替换为默认占位图
    img.onerror = null; // 避免无限循环
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


// 1. 通过 IP 获取城市信息
fetch('http://ipwho.is/?output=json&lang=zh-CN')
    .then(response => {
        if (!response.ok) throw new Error('IP定位失败');
        return response.json();
    })
    .then(ipData => {
        const data = JSON.parse(JSON.stringify(ipData));
        const city = data.city + '市';
        //console.log('定位城市:', city);
        // 2. 调用天气 API
        return fetch(`https://api.dwo.cc/api/tianqi?districtId=${encodeURIComponent(city)}`)
                    .then(weatherResponse => {
                        if (!weatherResponse.ok) throw new Error('天气数据获取失败');
                        return weatherResponse.json();
                    })
                    //.then(weatherResponse => weatherResponse.json())
                    .then(weatherData => {
                        // 3. 更新页面天气信息
                        $('#text_city').text(city || '未知城市');//城市
                        $('#text_weather').text(weatherData.data?.weather || '');//天气
                        $('#text_low').text(weatherData.data?.lowTemp || '');//最低气温
                        $('#text_high').text(weatherData.data?.highTemp || '');//最高气温
                        $('#text_wind').text(weatherData.data?.wind || '');//风向
                        $('#text_rh').text(weatherData.data?.rh || '');//相对湿度
                    });
    })
    .catch(error => {
        console.error('错误:', error);
        $('#text_city').html('<span class="error">定位或天气数据加载失败</span>');
    });


//获取时间
let t = null;
t = setTimeout(times, 1000);

function times() {
    clearTimeout(t);
    dt = new Date();
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
    t = setTimeout(times, 1000);
}

//脚注
$(document).ready(function () {
    var t1 = performance.now();
    if (typeof t1 != "undefined") { document.getElementById("time").innerHTML = " 页面加载耗时 " + Math.round(t1) + " 毫秒 "; }
    $.get("/cdn-cgi/trace", function (data) {
        sip = data.match(/(ip=?)(\S*)/)[2];
        str = data.match(/(colo=?)(\S*)/)[2];
        loc = data.match(/(loc=?)(\S*)/)[2];
        sts = data.match(/(http==?)(\S*)/)[2];
        tls = data.match(/(tls==?)(\S*)/)[2];
        $("#result").append("节点:" + str);
        $("#result").append("\n访客:" + loc);
        $("#result").append("\n" + sts);
        $("#result").append("\n加密:" + tls);
        $("#result").append("\nIP:" + sip);
    });
});



//弹出层控制
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

// ! 工具
fetch('/json/utils_data.json')               // 1. 发起请求
    .then(response => response.json())    // 2. 解析响应为 JSON
    .then(data => {                       // 3. 使用解析后的数据
        console.log(data);                  // 4. 打印数据
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
        console.error('工具加载 JSON 失败:', error);
    });


// ! 链接
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
                        data-bs-placement="bottom" title="${link.url}" rel="noopener noreferrer" data-link-id="${linkId}">
                        <div class="w-comment-entry">
                            <a>
                                <img data-src="${link.icon}" 
                                class="lozad img-circle" onerror="imgerrorfun();">
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

            // FIXME 图片是动态生成的（如通过 AJAX/Fetch 加载），
            // FIXME 需要在内容插入 DOM 后，重新初始化懒加载
            lozad('.lozad').observe();
        });
    })
    .catch(error => {                 // 6. 处理错误
        console.error('工具加载 JSON 失败:', error);
    });


//控制台输出
console.clear();
let styleTitle1 = `
font-size: 20px;
font-weight: 600;
color: rgb(244,167,89);
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
版 本 号：v1.0.0
更新日期：2025-07-24

Github:  https://github.com/killhub/
`
console.log(`%c${title1} %c${title2}
%c${content}`, styleTitle1, styleTitle2, styleContent)