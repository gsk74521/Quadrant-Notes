# 四象限便签 · Quadrant Notes

一个跨平台（Windows / macOS）的桌面便签工具，用艾森豪威尔四象限法则（重要 / 紧急）管理每天的任务。

[English](README_EN.md) · 简体中文

![平台](https://img.shields.io/badge/platform-Windows%20%7C%20macOS-blue)
![技术](https://img.shields.io/badge/built%20with-Electron%2033-47848f)
![许可](https://img.shields.io/badge/license-MIT-green)

## 预览

![应用界面截图](docs/screenshot.png)

## 功能特性

- **四象限看板**：重要且紧急（马上去做）、重要不紧急（计划去做）、紧急不重要（委托他人）、不紧急不重要（尽量不做），每个象限有独立配色与行动建议
- **时间胶囊**：可为任务设置时间，显示「今天 18:00」「明天 10:00」等友好格式，过期自动标红
- **完成打勾**：完成的任务变淡划线、自动排到象限末尾，象限右上角实时显示待办数量
- **自由缩放**：拖动便签右下角折角即可调整便签大小
- **中英双语**：界面一键切换中 / 英文，选择会被记住
- **开机自启**：可选择在登录后自动启动应用
- **数据本地保存**：数据保存在本机，离线可用，关闭重开不丢失；首次打开自带示例便签
- **零依赖运行时**：打包后为单文件便携应用，无需安装、无需联网

## 下载安装

前往 [Releases](https://github.com/gsk74521/Quadrant-Notes/releases) 页面下载最新版本：

| 平台 | 文件 | 说明 |
| ---- | ---- | ---- |
| Windows | `四象限便签-1.0.0.exe` | 便携版（portable），双击即用，免安装 |
| macOS | `四象限便签-1.0.0.dmg` | 拖入 Applications 即可 |

> macOS 首次打开如提示「无法确认开发者」，请在「系统设置 → 隐私与安全性」中允许打开。

## 从源码运行

需要 [Node.js](https://nodejs.org)（>= 18）：

```bash
npm install
npm start
```

## 打包构建

```bash
# Windows 便携版 exe
npm run dist:win

# macOS dmg（需在 macOS 或 Linux 上执行；Windows 无法构建 dmg）
npm run dist:mac
```

构建产物输出在 `dist/` 目录。图标由 `render-icons.js` 生成（`node render-icons.js`）。

## 测试

手工测试清单见 [TEST.md](TEST.md)，覆盖启动、添加、时间、打勾、缩放、删除、双语、数据保存与跨平台共 9 组场景。

## 技术栈

- [Electron](https://www.electronjs.org/) 33（主进程 + 预加载脚本，contextIsolation 开启）
- 渲染层为原生 HTML / CSS / JavaScript，无前端框架
- 数据存储：localStorage

## 目录结构

```
├── main.js           # Electron 主进程（窗口、菜单、开机自启）
├── preload.js        # 预加载脚本（contextBridge 暴露 startupAPI）
├── renderer/         # 渲染层（index.html / app.js / styles.css）
├── build/            # 应用图标与风格稿
├── docs/             # 文档图片
├── render-icons.js   # 图标生成脚本
└── dist/             # 构建产物（git 忽略）
```

## 许可证

[MIT](LICENSE)
