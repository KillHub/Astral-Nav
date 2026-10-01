/**
 * ============================================================
 * Live2D 看板娘初始化配置
 * ============================================================
 * 依赖：L2Dwidget.min.js（需在 index.html 中先于本文件引入）
 *
 * 优化说明：
 * - 模型从 raw.githubusercontent.com（境外、慢且不稳定）迁移到本地
 *   live2d_models/ 目录，避免外部依赖失效导致看板娘加载失败。
 * - 本地 seifuku 模型缺少贴图/动作文件（仅有 model.json），
 *   故改用本地完整的 shizuku 模型。
 *   如需换回 seifuku，请下载完整模型文件（.moc / 贴图 / .mtn）
 *   放入 live2d_models/ 后修改下方 jsonPath 即可。
 * ============================================================
 */
// 防御：CDN 上的 L2Dwidget 加载失败时跳过初始化，避免阻塞报错影响其他脚本
if (typeof L2Dwidget === 'undefined') {
    console.warn('L2Dwidget 加载失败，看板娘已跳过初始化');
} else {
L2Dwidget.init({
    "model": {
        // 本地模型路径（shizuku 制服少女模型，资源完整可离线加载）
        jsonPath: "/live2d_models/live2d-widget-model-shizuku/assets/shizuku.model.json",
        "scale": 0.9 // 模型缩放比例
    },
    "display": {
        "position": "right", // 显示位置（left/right）
        "width": 150,        // 画布宽度（px）
        "height": 300,       // 画布高度（px）
        "hOffset": 0,        // 水平偏移
        "vOffset": 400       // 垂直偏移（避免遮挡悬浮按钮）
    },
    "mobile": {
        "show": true,  // 移动端是否显示
        "scale": 0.5   // 移动端缩放比例
    },
    "react": {
        "opacityDefault": 0.8, // 默认透明度
        "opacityOnHover": 1    // 鼠标悬停透明度
    },
    "dialog": {
        "enable": true, // 启用点击对话
        "script": {
            "tap body": "哎呀！别碰我！",      // 点击身体时的对话
            "tap face": "要认真写代码哦~"      // 点击头部时的对话
        }
    }
});
}
