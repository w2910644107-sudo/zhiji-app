# 知机

极简国风命理问事网站。当前版本已接入 `lunar-javascript`，支持真实四柱八字排盘、真实今日日柱、问事案卷、本地命局、调局建议和个人数据统计。

## 本地运行

```bash
npm install
npm run dev
```

打开本地开发地址后即可预览。

## 主要路由

- `/`：首页，展示今日天时、问事入口和轻量生辰状态条。
- `/today`：真实今日干支、今日之象、对我的影响、宜忌、调局建议。
- `/ask`：问事占断，保存案卷到 localStorage。
- `/cases`：案卷列表、案卷详情、复制批文、删除案卷。
- `/life`：录入生辰并调用真实四柱八字排盘。
- `/adjust`：调局建议与方位、五行、心法参考。
- `/my`、`/me`：个人中心、本地数据、使用统计与偏好设置。
- `/debug/bazi`：排盘调试页。
- `/debug/today`：今日天时调试页。

## 构建

```bash
npm run build
```

## 部署

当前项目适合通过 EdgeOne Pages 从 GitHub 或 Gitee 导入后自动构建部署。详细步骤见 [DEPLOY_EDGEONE.md](./DEPLOY_EDGEONE.md)。

当前版本只使用浏览器本地存储，不需要配置数据库和环境变量。
