# ShareText - 局域网文本共享工具

ShareText 是一个简单而强大的局域网文本共享工具，允许用户在同一局域网内的不同设备之间实时共享和编辑文本内容。

## 主要特性

- ✨ 实时同步：基于 WebSocket 的即时文本同步
- 📱 跨平台支持：支持电脑和移动设备访问
- 💾 自动保存：文本内容自动保存到服务器
- 📋 一键复制：支持一键复制全部内容
- 🌐 局域网访问：同一网络下的所有设备都能访问
- 🎨 响应式设计：完美适配各种屏幕尺寸

## 技术栈

- 后端：Node.js + Express + WebSocket
- 前端：原生 JavaScript + HTML5 + CSS3
- 存储：本地文件系统

## 快速开始

1. 确保已安装 Node.js（建议版本 14.0.0 或更高）

2. 克隆项目并安装依赖：
```bash
git clone [项目地址]
cd ShareText
npm install
```

3. 启动服务器：
```bash
npm start
```

4. 访问应用：
- 本机访问：http://localhost:8322
- 局域网访问：http://[你的IP地址]:8322

## 使用说明

1. 打开网页后即可在文本框中输入内容
2. 内容会自动保存和同步到其他设备
3. 点击左上角的"复制全部"按钮可以复制所有内容
4. 支持在任何设备上编辑和查看内容

## 项目结构

```
ShareText/
  ├── package.json      # 项目配置文件
  ├── server.js         # 服务器入口文件
  ├── public/           # 静态资源目录
  │   ├── index.html    # 主页面
  │   ├── style.css     # 样式文件
  │   └── script.js     # 前端脚本
  └── data/             # 数据存储目录
      └── content.txt   # 文本内容存储文件
```

## 注意事项

- 确保所有设备都在同一个局域网内
- 防火墙可能需要允许 8322 端口的访问
- 建议在可信任的网络环境中使用

## 开发计划（待定）

- [ ] 添加多房间支持
- [ ] 添加用户认证
- [ ] 添加历史记录功能
- [ ] 添加 Markdown 支持
- [ ] 添加文件上传功能

## 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进项目。

## 许可证

本项目采用 MIT 许可证