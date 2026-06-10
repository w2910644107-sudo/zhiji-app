# EdgeOne Pages 部署说明

本文档用于将「知机」部署到腾讯云 EdgeOne Pages。当前项目是 Next.js 应用，可以从 GitHub 或 Gitee 仓库导入后自动构建部署，无需购买服务器，也不需要自行配置 Nginx、PM2。

## 部署方式

- 使用 GitHub 或 Gitee 仓库导入。
- 由 EdgeOne Pages 自动安装依赖、构建和发布。
- 不需要购买云服务器。
- 不需要配置 Nginx、PM2 或服务器运行环境。

## 控制台操作步骤

1. 打开 EdgeOne Pages 控制台。
2. 创建项目。
3. 选择从 Git 仓库导入。
4. 授权 GitHub 或 Gitee。
5. 选择当前项目仓库。
6. 框架选择 `Next.js`。
7. 安装命令填写：

```bash
npm install
```

8. 构建命令填写：

```bash
npm run build
```

9. 输出目录保持默认。
10. 点击部署。
11. 部署完成后，打开 EdgeOne Pages 给出的默认域名测试。

## 部署后测试路径

```text
/
/today
/ask
/adjust
/life
/cases
/me
/debug/bazi
/debug/today
```

## 当前版本说明

- 使用 `localStorage` 保存生辰、案卷、偏好和用量统计。
- 换浏览器、换设备或清理缓存后，本地数据会消失。
- 当前没有登录系统。
- 当前没有数据库。
- 当前没有支付。
- 当前没有真实用户云端同步。
- 当前不需要配置环境变量。

## 中国访问说明

- EdgeOne Pages 更适合国内访问体验。
- 当前可以先使用 EdgeOne Pages 默认域名体验。
- 如果后续绑定自定义域名，可能需要根据域名、服务区域和业务要求处理备案。

## 常见问题

### 构建失败怎么办

先在本地运行：

```bash
npm install
npm run build
```

如果本地也失败，优先根据终端提示修复 TypeScript、ESLint 或依赖错误。确认本地构建成功后，再重新触发 EdgeOne Pages 部署。

### 页面白屏怎么办

先打开浏览器开发者工具查看 Console 报错。常见原因包括依赖安装失败、构建产物未生成、浏览器缓存异常或部署平台构建配置填写错误。确认安装命令为 `npm install`，构建命令为 `npm run build`。

### localStorage 数据为什么换设备没有

当前版本的数据保存在浏览器本地 `localStorage` 中，不会同步到云端。换浏览器、换设备或清理缓存后，本地数据都会消失。

### 如何后续接数据库

后续可以增加后端数据层，把生辰、案卷、偏好和统计从 `localStorage` 迁移到数据库。常见选择包括 Supabase、腾讯云数据库、PostgreSQL 或其他托管数据库。接入前建议先设计用户系统和数据权限。

### 如何后续接 Agent/API

后续可以通过服务端 API Route 或独立后端接入 Agent/API。不要把 API Key 写到前端，也不要在客户端直接请求需要密钥的服务。建议先把当前本地规则稳定下来，再逐步把问事解释、案卷总结或追问能力接入服务端。
