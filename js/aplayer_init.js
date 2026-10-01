/**
 * ============================================================
 * APlayer 音乐播放器初始化
 * ============================================================
 * 依赖：APlayer.min.js（需在 index.html 中先于本文件引入）
 * 容器：页面右上角导航栏中的 <div id="aplayer"></div>
 * ============================================================
 */
// 防御：CDN 上的 APlayer 加载失败时跳过初始化，避免阻塞报错影响其他脚本
if (typeof APlayer === 'undefined') {
    console.warn('APlayer 加载失败，音乐播放器已跳过初始化');
} else {
const ap = new APlayer({
    container: document.getElementById('aplayer'), // 绑定播放器容器
    autoplay: true,      // 自动播放（现代浏览器可能因自动播放策略阻止，属正常现象）
    loop: 'all',         // 列表循环（'all' 列表循环 | 'one' 单曲循环 | 'none' 不循环）
    volume: 0.7,         // 默认音量（0~1）
    lrcType: 3,          // 歌词类型：3 = 加载外部 LRC 歌词文件
    audio: [
        {
            name: '豪杰春香 - 미안해요 하는 게', // 歌曲名称
            artist: '原唱',                     // 歌手
            url: '/music/豪杰春香.mp3',         // 音频文件路径
            cover: '/images/豪杰春香.png',      // 封面图
            lrc: '/music/豪杰春香.lrc',         // 歌词文件（LRC 格式）
        },
        // 如需添加更多歌曲，在此继续追加对象即可
    ]
});
}
