# music-web UI 优化总结

## 视觉现代化
- 毛玻璃效果：播放器 `backdrop-blur-lg`，弹窗遮罩 `backdrop-blur-sm`
- 大圆角：`rounded-lg` → `rounded-xl`，封面 `rounded-md` → `rounded-lg`
- 渐变色按钮：搜索/CTA 按钮 `from-red-500 to-rose-400`，hover 微浮起
- 统一过渡动画：所有交互元素 `transition-colors duration-200`

## 暗色模式
- UnoCSS `dark: 'class'` 策略
- `stores/theme.js` — localStorage 持久化，跟随系统偏好
- 搜索栏右侧太阳/月亮切换按钮
- 全部组件适配 `dark:` 变体

## 加载体验
- `SkeletonRow.vue` — 骨架屏替代"加载中..."文字
- 曲库搜索中也有骨架屏
- 列表底部统一 `Loader2` + "Loading..." / "Load More"

## 播放器增强
- 红色顶边框 → 上阴影分隔
- 右侧显示 `当前时间 / 总时长`
- 进度条渐变 + 灰色轨道
- 歌词按钮（ScrollText 图标，在循环按钮右侧）
- 自定义 div 音量滑块（点击跳转 + 拖动调节 + 点击图标静音）

## 歌词功能
- `utils/lyrics.js` — LRC 解析器
- `LyricsModal.vue` — 全屏浮层：左封面+信息，右滚动歌词
- 当前行红色高亮居中，自动跟随播放
- 点击歌词行跳转播放
- 打开时自动定位到当前行
- 左右面板滑入/滑出过渡（500ms 样式过渡）

## 交互细节
- 搜索框内部 Search 图标
- 曲库搜索结果 hover 有圆角背景
- 结果计数固定不随滚动
- 列表到底部用细线分隔符
- 弹窗 ESC 关闭（LyricsModal）
- Toast 淡入 + 上滑动画
- ConfirmModal z-index 和最小宽度修正
