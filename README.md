# 中医方证互动传习系统

依托 [nihaisha-tcm](https://github.com/JuneYaooo/nihaisha-tcm) 倪海厦中医课程蒸馏资料，构建的体系化中医学习前端。

## 功能模块

- **体系概览** — 学习进度与统计数据
- **逐课教室** — 按课次研析伤寒论教案
- **经方比勘** — 仲景经方方证对比研审
- **六经辨证** — 伤寒六经气化辨证路线
- **经络穴位** — 十四经脉经纬模型
- **本草配伍** — 药性原理沙箱
- **随课笔记** — 学者备忘笔记本

## 技术栈

React 19 + Vite + TypeScript + Tailwind CSS 4 + @google/genai

## 本地运行

**前置条件:** Node.js

1. 安装依赖: `npm install`
2. 设置 `GEMINI_API_KEY` 到 `.env` 文件
3. 启动开发服务器: `npm run dev`
4. 构建生产版本: `npm run build`

## 部署

本项目部署在 ModelScope 创空间: https://www.modelscope.cn/studios/imtaotao/zhongyi_learning

独立访问地址: https://imtaotao-zhongyi-learning.ms.show

## 许可

Apache License 2.0
