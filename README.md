# URA — 山东省大学生长跑联盟赛事平台

山东省大学生长跑 IP 赛事官方报名与管理平台原型。当前版本聚焦选手报名闭环（浏览赛事 → 查看详情 → 填写报名 → 模拟支付 → 查询状态）与一个简易管理后台（创建/编辑赛事、查看报名名册）。

抽签系统、电子证书、真实支付网关、实名认证、发票等功能为后续阶段规划，本原型暂未实现。

## 技术栈

- **框架**：Next.js 15（App Router）+ React 19，Server Components 负责数据展示，Server Actions 负责表单提交与数据变更
- **数据库**：SQLite + Prisma ORM 6
- **样式**：手写 CSS 自定义属性（设计系统变量），不依赖 Tailwind
- **字体**：Space Grotesk（标题）+ Outfit（正文），通过 Google Fonts 引入
- **语言**：TypeScript

## 目录结构

```
src/
├── app/                  # 页面与路由（含 admin 管理后台）
├── components/           # 复用组件
└── lib/                  # Prisma 客户端、数据访问函数、常量、管理员认证
prisma/
├── schema.prisma         # 数据模型
seed.ts                   # 种子数据脚本
```

## 本地部署

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env` 文件：

```
DATABASE_URL="file:./dev.db"
ADMIN_SECRET="你的管理后台密钥"
```

`ADMIN_SECRET` 用于管理后台登录，是一个共享密钥，**非生产级安全方案**，仅用于原型演示。

### 3. 初始化数据库

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。管理后台入口在 `/admin`，使用 `.env` 中配置的 `ADMIN_SECRET` 登录。

## 其他命令

```bash
npm run build   # 生产构建
npm run start   # 启动生产服务器（需先执行 build）
npm run lint    # 代码检查
npx prisma studio   # 可视化查看/编辑数据库
```
