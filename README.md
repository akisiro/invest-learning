# 我的投资学习网站

技术方案：GitHub Pages + MkDocs Material。中文导航、搜索、阅读书目与笔记模板已配置。不包含原仓库的 PDF 或介绍正文。

## 第一步：创建干净仓库

在自己的 GitHub 账号下新建公开仓库，例如 `invest-learning`，默认分支使用 `main`。不要直接复制原仓库，也不要把原 PDF 加入提交历史。公开仓库的文件本身可被访问，即使文件没有进入网站。

## 第二步：上传文件

将本目录的内容放到仓库根目录。必须包含隐藏目录 `.github/workflows/pages.yml`；不要额外套一层 `invest-learning` 文件夹。可以通过 GitHub 的 Add file → Create new file 单独创建该工作流路径，复制对应文件内容。

## 第三步：启用 Pages

打开仓库 Settings → Pages → Build and deployment，将 Source 选择为 GitHub Actions。需要仓库管理权限。

然后进入 Actions，选择 Build and deploy learning site，点击 Run workflow，在 main 上运行。后续提交 main 会自动更新；PR 只构建检查。

## 第四步：验证发布

1. 确认 Actions 的 build 和 deploy 均成功。
2. 从部署结果或 Settings → Pages 打开实际返回的网址。
3. 检查首页、学习路线、书目与笔记模板；搜索“小狗钱钱”，确认能找到书目页。
4. 手机打开页面，检查导航；修改一行文字并提交，确认新版本上线。

普通项目网址通常为 `https://用户名.github.io/仓库名/`，以部署实际输出为准。本站使用相对链接，可运行在仓库子路径。确定仓库后可在 mkdocs.yml 补充 site_url 和 repo_url。

## 本地检查（可选）

```powershell
python -m venv .venv
.venv\Scripts\python -m pip install -r requirements.txt
.venv\Scripts\python -m mkdocs build --strict
.venv\Scripts\python -m mkdocs serve
```

依赖采用版本范围；正式长期维护时可将成功构建的依赖锁定为经过验证的确切版本。

## 常见问题

- 404：先检查 deploy 是否成功，再打开部署输出的网址；确认仓库名路径。
- 工作流不存在：检查 `.github/workflows/pages.yml` 是否位于根目录、是否提交到 main。
- Pages 未启用或权限错误：检查 Source 为 GitHub Actions、仓库 Actions 权限与 github-pages 环境的分支规则。
- 构建失败：打开失败步骤日志；strict 模式会阻止存在警告的构建发布。

## 原仓库初查（2026-10-16）

原仓库 main 页面显示 README.md 与 17 个 PDF 文件，未见网站配置、构建工作流、许可证文件或书籍授权说明。README 主要汇总书籍、纪录片、频道等，含指向仓库 PDF 和外部视频站点的链接。本次未逐本核实版权归属，也未把“未见许可”判定为所有文件必然侵权。采用干净新仓库，避免将授权尚未确认的内容公开复制。

参考：
- https://github.com/codeman008/Financial_freedom
- https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/licensing-a-repository
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://squidfunk.github.io/mkdocs-material/publishing-your-site/
