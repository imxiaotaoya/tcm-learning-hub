"""中医方证互动传习系统 — ModelScope Studio 入口

以 Gradio 为壳，内嵌 React SPA。Gradio 挂在 /_gradio 子路径，
React 前端由 FastAPI 直接在根路径 / 上提供静态文件服务。
"""

import os
import gradio as gr
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, HTMLResponse

DIST = os.path.join(os.path.dirname(__file__), "dist")

# 读取构建好的 index.html
with open(os.path.join(DIST, "index.html"), "r", encoding="utf-8") as f:
    INDEX_HTML = f.read()

# ── FastAPI ──────────────────────────────────────────────
fastapi_app = FastAPI(title="中医方证互动传习系统")

# 挂载资源文件（JS / CSS / 图片）
fastapi_app.mount(
    "/assets",
    StaticFiles(directory=os.path.join(DIST, "assets")),
    name="assets",
)


# SPA 回退路由：所有路径优先匹配文件，否则返回 index.html
@fastapi_app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    file_path = os.path.join(DIST, full_path)
    if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
        return FileResponse(file_path)
    return HTMLResponse(content=INDEX_HTML)


# ── Gradio 包装 ───────────────────────────────────────────
with gr.Blocks(title="中医学习") as demo:
    gr.Markdown(
        "# 🏥 中医方证互动传习系统\n\n"
        "React 前端已挂载在根路径 `/` ，本 Gradio 页面仅供 Studio 运行时检测。"
    )

# 将 Gradio 挂到 /_gradio 子路径
app = gr.mount_gradio_app(fastapi_app, demo, path="/_gradio")

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("GRADIO_SERVER_PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)
