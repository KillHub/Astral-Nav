# Astral-Nav 优化记录

> 优化日期：2026-10-01
> 优化范围：安全修复、Bug 修复、性能优化、工程化基础（未涉及文件删除等破坏性操作）
> 验证方式：全部 JS 通过 `node --check` 语法检查；index.html 通过 HTML 标签配对校验

---

## 一、新增文件

| 文件 | 说明 |
|---|---|
| `js/live2d_init.js` | Live2D 看板娘初始化配置（从 index.html 内联脚本抽取） |
| `js/aplayer_init.js` | APlayer 音乐播放器初始化（从 index.html 内联脚本抽取） |
| `js/page_extras.js` | 页面附加功能合集：window.open 外链拦截、链接角标统计、悬浮快速搜索、`openLinkInSwal`（从 index.html 内联脚本抽取） |
| `.gitignore` | 忽略 `.DS_Store`、`.idea/`、`*.rar` 等不应入库的文件 |
| `OPTIMIZATION.md` | 本文档 |

---

## 二、修改明细

### 1. index.html（1206 行 → 925 行）

**性能优化**
- 所有非关键 JS（jQuery、Bootstrap、GSAP、iziToast、SweetAlert2、APlayer、Live2D、lozad、i18next 及本站脚本）统一添加 `defer`，不再阻塞首屏渲染
- 和风天气图标改为引用本地 `css/qweather-icons.css`（原 CDN 链接与本地文件重复，已移除）
- Live2D 模型从 `raw.githubusercontent.com`（境外、慢且不稳定）迁移到本地 `live2d_models/` 目录
  - ⚠️ 注意：本地 seifuku 模型缺少贴图/动作文件，改用本地完整的 **shizuku** 模型，看板娘外观会变化；如需换回 seifuku，下载完整模型文件后修改 `js/live2d_init.js` 中的 `jsonPath` 即可
- 6 段内联脚本（Live2D 配置、window.open 拦截、角标统计、悬浮搜索、APlayer、openLinkInSwal）全部抽取到 `js/` 目录独立文件

**Bug 修复**
- `target="_black"` → `target="_blank"`（拼写错误）
- `id="fk-span"` / `id="fk-span-right"` 在页面重复出现 4 次（HTML 非法），改为 class，CSS 选择器同步修改
- `og:url` 从占位符 `astral-nav.example.com` 改为真实地址 `https://killhub.github.io/Astral-Nav/`
- `og:image` 从不存在的 `/images/og-image.jpg` 改为已存在的 `/images/logo.png`

### 2. js/script_function.js

**重大改动：eval 混淆代码还原**
- 文件开头的 packer 混淆代码（搜索框逻辑）还原为可读、带完整注释的原生 JS 实现，功能不变：记忆搜索引擎选择、记忆「新窗口打开」开关、切换引擎同步 placeholder、提交拼接 URL 跳转

**Bug 修复**
- `imgerrorfun()` 不再依赖全局 `event` 对象（Firefox 不兼容），改为 `onerror="imgerrorfun(this)"` 显式传参
- `times()` 中 `dt` 隐式全局变量改为 `const` 声明；删除无效的 `clearTimeout(null)`
- 删除 `$.get("/cdn-cgi/trace")` 访客信息展示：该接口是 Cloudflare 专有功能，GitHub Pages 上返回 404，正则 match 为 null 会抛 TypeError
- 移除 `console.clear()`（会抹掉调试有用的报错）及动漫语录/励志英语的多余 `console.log`

**死代码清理**
- 删除 `fetchWeatherData()` 旧天气实现（已被 qweather.js 取代，且其 `http://ipwho.is` 在 HTTPS 下会被拦截）

**性能优化**
- 「回到顶部」scroll 监听改用 `requestAnimationFrame` 节流
- 星空动画星星数量增加 400 颗上限（避免宽屏掉帧）；resize 监听增加 200ms 防抖

**可靠性**
- 动漫语录、励志英语 fetch 补充 `.catch` 降级处理，API 故障时不再产生未捕获的 Promise 报错

### 3. js/qweather.js

- **混合内容 Bug 修复**：定位方式 B 原接口 `http://ip-api.com/json/` 为明文 HTTP，在 HTTPS 页面下必被浏览器拦截（该路径从未生效），改用支持 HTTPS 的 `https://ipwho.is/`，字段名同步调整（`lat/lon` → `latitude/longitude`）
- 删除会泄露访客 IP/定位信息的 `console.log`
- 删除注释中明文写出的完整 API 请求（含密钥）；密钥处补充安全提示注释
- 修复「重试」按钮失效：内部函数 `fetchWeatherInfo` 暴露到 `window`，供 onclick 调用

### 4. js/search_suggestion.js

- 联想词请求增加 **300ms 防抖**（原每次击键都发起 JSONP 请求）
- 键盘事件从已废弃的 `e.keyCode` 迁移到 `e.key`（`'ArrowUp'` / `'ArrowDown'` / `'Enter'` / `'Escape'`）
- 移除与 script_function.js 职责重复的表单 submit 处理器（其注入的 hidden 参数从未实际生效）

### 5. js/i18n.js

- `debug: true` → `debug: false`，关闭生产环境调试日志

### 6. css/style_core.css / css/style_dark.css

- `#fk-span` / `#fk-span-right` 选择器改为 `.fk-span` / `.fk-span-right`（配合 HTML 重复 id 修复）
- 角标样式 `.link-badge`、`.w-widget.box2` 从 index.html 内联 `<style>` 迁移至 style_core.css 末尾

### 7. Git 仓库

- 新增 `.gitignore`
- 执行 `git rm --cached` 取消跟踪 `.idea/` 目录与 `.DS_Store`（本地文件保留，仅移出版本控制）
- ⚠️ 以上变更已暂存（staged）但**未提交**，确认无误后请自行 commit

---

## 三、仍需你决策/手动处理的事项

| 优先级 | 事项 | 说明 |
|---|---|---|
| 🔴 高 | **重置和风天气 API Key** | Key `30247c...69e9` 已长期暴露在公开仓库，请到和风控制台重置，并配置用量上限 |
| 🟡 中 | 仓库瘦身 | `assets/`（23M，含 `Pokémon GO.rar` 和未被引用的学习路线图）、`music/豪杰春香.mp3`（7.8M）、`Steven.jpg`（1.1M 用作 40px 头像）建议压缩或移出仓库，确认后我可以处理 |
| 🟡 中 | Live2D 看板娘外观 | 已切换为本地 shizuku 模型，如想保留原 seifuku 外观需补全模型文件 |
| 🟢 低 | Tabler Icons 版本 | 页面用 CDN 3.34.0，本地存的是 2.42.0，建议统一（本地化或删本地旧版） |
| 🟢 低 | i18n key 规范化 | 目前用中文原文做 key，建议后续改为语义化 key（如 `nav.search`） |

---

## 四、后续建议（本次未做）

1. **依赖本地化收尾**：SweetAlert2 / APlayer / Font Awesome / Tabler 仍走 bootcdn，可逐步本地化消除 CDN 单点故障
2. **图片优化**：全站 PNG/JPG 可转 WebP，`images/` 可整体压缩
3. **部署缓存策略**：GitHub Pages 默认缓存 10 分钟，可在文件名加版本 hash 控制更新节奏
