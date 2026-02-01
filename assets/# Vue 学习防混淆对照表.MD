# Vue 学习防混淆对照表  
## ——《Vue.js 实战（Vue2）》→ Vue 3 正确学习指南（零基础版）

> 使用说明：
> - 🟢 必须掌握：放心记，永不过时  
> - 🟡 认识即可：知道有即可，不要死记  
> - 🔴 明确忽略：现在学 = 制造混淆  

---

## 一、核心思想层（最重要）

| 内容 | Vue 2 书中表现 | 是否该学 | Vue 3 视角 | 学习建议 |
|---|---|---|---|---|
| 响应式思想 | data 改 → 视图变 | 🟢 | ref / reactive | **必须理解** |
| 数据驱动 UI | 不操作 DOM | 🟢 | 完全一致 | **牢记** |
| 组件化 | 页面拆组件 | 🟢 | 完全一致 | **重点** |
| 单向数据流 | props / 事件 | 🟢 | 完全一致 | **重点** |
| 关注点分离 | UI / 逻辑 / 状态 | 🟢 | setup 更清晰 | 理解即可 |

---

## 二、模板 & 视图层（最安全）

| 内容 | Vue 2 写法 | 是否记 | Vue 3 写法 | 建议 |
|---|---|---|---|---|
| 插值 | {{ msg }} | 🟢 | 相同 | 放心用 |
| 条件渲染 | v-if | 🟢 | 相同 | 放心用 |
| 列表渲染 | v-for | 🟢 | 相同 | 放心用 |
| 事件绑定 | @click | 🟢 | 相同 | 放心用 |
| 属性绑定 | :class | 🟢 | 相同 | 放心用 |
| 指令修饰符 | .stop .prevent | 🟡 | 相同 | 用时查 |

---

## 三、组件通信（重点）

| 场景 | Vue 2 书中 | 是否掌握 | Vue 3 正解 |
|---|---|---|---|
| 父 → 子 | props | 🟢 | defineProps |
| 子 → 父 | $emit | 🟢 | defineEmits |
| 插槽 | slot / scoped slot | 🟢 | <slot> |
| 多层通信 | event bus | 🔴 | ❌ 废弃 |
| 全局状态 | Vuex | 🟡 | Pinia |

---

## 四、状态 & 响应式 API

| 内容 | Vue 2 | 是否学 | Vue 3 |
|---|---|---|---|
| data() | 核心 | 🟢（思想） | ref / reactive |
| computed | 常用 | 🟢 | computed |
| watch | 常用 | 🟢 | watch |
| watchEffect | 无 | 🟡 | watchEffect |
| this.xxx | 常见 | 🔴 | ❌ 不推荐 |

---

## 五、生命周期（易混淆）

| Vue 2 | 是否记 | Vue 3 |
|---|---|---|
| beforeCreate | 🔴 | ❌ |
| created | 🟡 | setup |
| mounted | 🟡 | onMounted |
| updated | 🟡 | onUpdated |
| destroyed | 🟡 | onUnmounted |

> 规则：  
> - 只记「挂载 / 更新 / 卸载」  
> - 名字不用死记  

---

## 六、Options API（混淆重灾区）

| 内容 | 是否学习 | 说明 |
|---|---|---|
| data() | 🟡 | 理解思想即可 |
| methods | 🟡 | 当普通函数 |
| computed | 🟡 | 不模仿结构 |
| watch | 🟡 | 同上 |
| this | 🔴 | Vue 3 主流不用 |

---

## 七、路由 & 状态管理

| 内容 | Vue 2 | 是否学 | Vue 3 |
|---|---|---|---|
| Vue Router | 必备 | 🟢 | 仍必备 |
| Vuex | 官方 | 🔴 | Pinia |
| mapState | 常见 | 🔴 | ❌ |
| 模块化 store | 常见 | 🟡 | Pinia 更简单 |

---

## 八、工程 & 构建（直接跳过）

| 内容 | 是否忽略 |
|---|---|
| Vue CLI | 🔴 |
| Webpack 配置 | 🔴 |
| 老插件生态 | 🔴 |
| IE 兼容 | 🔴 |

> 推荐：Vite + Vue 3

---

## 九、Vue 2 → Vue 3 翻译表（必收藏）

| Vue 2 书中 | Vue 3 正确理解 |
|---|---|
| data() | ref / reactive |
| methods | 普通函数 |
| computed | computed() |
| watch | watch() |
| this.xxx | ❌ 直接变量 |

---

## 十、最终安全结论

> 只要遵守三条规则：
> 1. 模板语法放心学  
> 2. 组件通信放心学  
> 3. Options API 不照抄  

✅ **你一定不会学歪**

---

## 给初学者的一句话

> 学错不是风险  
> 停下来不学才是