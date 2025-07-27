![Astral-Nav](https://socialify.git.ci/KillHub/Astral-Nav/image?font=Source+Code+Pro&forks=1&issues=1&language=1&name=1&owner=1&pattern=Floating+Cogs&pulls=1&stargazers=1&theme=Light)

### 🌈🐛 更新说明

##### V1.0.0 - 2025.7.11 
- 第一次提交，纯静态版本提交

##### V1.1.0 - 2025.7.13
- 第二次提交，重构了部分代码，用 json 维护数据

##### V1.2.0 - 2025.7.14 
- 第三次提交，完全用 json 维护数据

##### V1.3.0 - 2025.7.15 
- 重新编写README文档

##### V1.3.1 - 2025.7.15
- 右下角增加 Live2D 看板娘 互动

##### V1.3.2 - 2025.7.16
- 右下角增加 🔍搜索快速定位链接功能

##### V1.3.3 - 2025.7.16
- filterLinks 函数增加异常处理，防止极端输入导致 JS 报错。
- 夜间模式下悬浮搜索弹窗背景更深色，减少刺眼。
- 增加功能：链接卡片点击次数统计与角标显示

##### V1.3.4 - 2025.7.16
- 增加音乐播放器，APlayer.js

##### V1.3.5 - 2025.7.17
- 增加全国常用电话号码列表页面
- 音乐播放器增加歌词显示

##### V1.3.6 - 2025.7.17
- 动态调整路径（适用于子目录部署）GitHub Pages（[🌈页面预览🌈](https://killhub.github.io/Astral-Nav/)）

##### V1.3.7 - 2025.7.18
- 增加功能：外链导航点击检测，无法访问自动跳转404页面

##### V1.3.8 - 2025.7.21
- 增加功能：底部增加动漫语录，励志英语，樱花效果、梅花效果、春节灯笼等API

##### V1.3.9 - 2025.7.22
- 优化：页面图标增加宝可梦主题

##### V1.4.0 - 2025.7.27
- 优化：SEO 和可访问性
- 增加：MAC 资源分类

---

## 👋 你好，我是 Steven Zhao 

**👤 人设标签：**   
💻 代码炼金师 | 🎮 游戏探险家 | 🎬 光影捕手 
📚 纸间收藏家 | 🌄 山野漫游者 | ⚫⚪ 黑白策士（学徒版）

**📌 自我介绍：**   
『&emsp;在二进制星河中拓荒，于量子潮汐里涅槃；  
&emsp;以光影为镜窥见百态，用脚步作尺丈量天地；  
&emsp;书籍是镌刻智慧的拓扑监狱，棋盘是落子无悔的人生道场；  
&emsp;在下**Steven**，——    
&emsp;一个在多元宇宙中野蛮生长的探险家。』

**🌱 技能标签**： Java / 前端开发 / Python 等等~

**📊 近期项目**：  
- [Astral-Nav 星界导航（可预览）](https://github.com/KillHub/Astral-Nav)：为了记录学习到的前端知识构建的静态网站

**📫 联系方式**：  
- 邮箱：01loveslife@gmail.com

---

## 📌 项目名称  
**📝 简介**：Astral-Nav 星界导航，个人精选书签。

**🧙 作者**：Steven Zhao

**📸 截图**：  
[![pV8hemV.png](https://s21.ax1x.com/2025/07/21/pV8hemV.png)](https://imgse.com/i/pV8hemV)


### ✨ 功能特性  
✅ 精选资源     
✅ 随机二次元背景   
✅ 实时天气   
✅ 快速定位搜索        
✅ 今日诗词           
✅ JSON易维护   
✅ Live 2D 看板娘   
✅ 在线工具  
✅ 音乐播放器    
✅ 数字角标访问计数 

### 💡 快速开始 

**🚀 安装**

```git
git clone https://github.com/KillHub/Astral-Nav
```

**🌞 GitHub Pages 部署**

```javascript
    // 更改这些路径，使其适用于项目名部署。不然会找不到静态资源。
    <!-- TAG: 搜索：href="/ → 替换为：href=" -->
    <!-- TAG: 搜索：src="/ → 替换为：src=" -->
    <!-- TAG: 搜索：url('/' → 替换为：url('（针对 CSS 文件） -->
    <!-- TAG: 搜索：'/images → 替换为：'images -->
    <!-- TAG: 搜索：'/music → 替换为：'music -->
    <!-- TAG: 搜索：fetch('/json → 替换为：fetch('json -->
    <!-- TAG: 搜索："/pages → 替换为："pages -->
```

```
  // 📕注释标记说明
  TODO
  示例：// TODO: 实现用户登录页
  用途：标记『待办事项』待办事项或待实现的功能。
  FIXME
  示例：// FIXME: 修复空指针异常
  用途：标记『需要修复』的代码问题或错误。
  NOTE
  示例：// NOTE: 此方法仅用于测试环境
  用途：添加『说明性注释』或重要信息。
  TAG
  示例：// TAG: 性能优化
  用途：『自定义标签』，用于分类或标记特定代码段。
  INFO
  示例：// INFO: 2025-07-22 更新缓存机制
  用途：标记信息性注释（如『版本更新、作者』等）。
  BUG
  示例：// BUG: 数据计算结果不正确
  用途：标记已知的『代码缺陷』或问题。
  HACK
  示例：// HACK: 临时绕过权限检查
  用途：标记『临时解决』方案或需要优化的代码。
  XXX
  示例：// XXX: 代码可读性差，需重构
  用途：标记『需要改进或重构』的代码。
  UPDATE
  示例：// UPDATE: 升级到最新 API 版本
  用途：标记『需要更新』的代码或依赖。
  FEAT
  示例：// FEAT: 支持多语言切换
  用途：标记『新增功能』或需求（常见于敏捷开发）。
```



**❤️ 特别鸣谢（不分先后）**
- [Astral-Nav](https://github.com/KillHub/Astral-Nav)
- [Aplayer](https://github.com/MoePlayer/APlayer)
- [Live2D 看板娘](https://github.com/xiazeyu/live2d-widget)
- [WebStackPage](https://github.com/WebStackPage/WebStackPage.github.io)
- [新逸Cary API](https://api.xinac.net/)
- [今日诗词 API](https://www.jinrishici.com/)
- [韩小韩 WebAPI 接口站](https://api.vvhan.com/)
- [Wayne-Nav-master](https://github.com/Waynenet/Wayne-Nav)
- [蔚蓝工具箱](https://github.com/core666666/Blue-IT-Too)
- [小渡API](https://api.dwo.cc/)

**😂 Star History**

[![Star History Chart](https://api.star-history.com/svg?repos=KillHub/Astral-Nav&type=Date)](https://www.star-history.com/#KillHub/Astral-Nav&Date)

**📄 许可证**
> 本项目采用 MIT License，详情见 [LICENSE](https://opensource.org/license/MIT) 文件。

