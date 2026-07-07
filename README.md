# URA — 山东省大学生长跑赛事平台

山东省大学生长跑 IP 赛事官方报名与管理平台。当前版本实现了选手认证（注册/登录）、赛事报名闭环（浏览赛事 → 查看详情 → 实名报名 → 模拟支付 → 查询状态）、选手个人中心（我的报名）以及管理后台（赛事管理、报名名册）。

抽签系统、电子证书、真实支付网关、实名认证、发票等功能为后续阶段规划，当前版本暂未实现。

## 技术栈

- **框架**：Next.js 15（App Router）+ React 19，Server Components 负责数据展示，Server Actions 负责表单提交与数据变更
- **数据库**：SQLite + Prisma ORM 6
- **认证**：Cookie + scrypt 哈希（Node.js `crypto` 内置模块），手机号 + 密码登录
- **样式**：手写 CSS 自定义属性（设计系统变量），不依赖 Tailwind
- **字体**：Space Grotesk（标题）+ Outfit（正文），通过 Google Fonts 引入
- **语言**：TypeScript

## 功能模块

### 前端页面

| 路由 | 说明 |
|---|---|
| `/` | 首页 — Hero 大图、赛事推荐、统计数字 |
| `/events` | 赛事列表页 |
| `/events/[id]` | 赛事详情页 |
| `/events/[id]/register` | 报名页（需登录） |
| `/registration/[id]` | 报名成功 / 支付确认页 |
| `/registration/lookup` | 报名查询（按身份证号） |
| `/runner/login` | 选手登录 |
| `/runner/register` | 选手注册（手机号 + 密码 + 个人信息） |
| `/runner/my-registrations` | 我的报名（登录后可见） |
| `/admin/login` | 管理后台登录 |
| `/admin` | 管理后台仪表盘 |
| `/admin/events` | 赛事管理列表 |
| `/admin/events/new` | 创建新赛事 |
| `/admin/events/[id]` | 赛事概览 |
| `/admin/events/[id]/edit` | 编辑赛事 |
| `/admin/events/[id]/registrations` | 报名名册 |

### 认证体系

- **管理员**：共享密钥登录（`ADMIN_SECRET`），通过 Cookie 维持会话
- **选手**：手机号 + 密码注册/登录，密码使用 scrypt 加盐哈希存储，Cookie `ura_runner_session`（7 天有效期）
- **报名守卫**：报名赛事前必须登录，登录后自动预填选手个人信息

## 目录结构

```
src/
├── app/
│   ├── page.tsx                  # 首页
│   ├── layout.tsx                # 根布局（字体加载）
│   ├── globals.css               # 全局样式与设计系统变量
│   ├── events/
│   │   ├── page.tsx              # 赛事列表
│   │   └── [id]/
│   │       ├── page.tsx          # 赛事详情
│   │       └── register/        # 报名表单 + action
│   ├── registration/
│   │   ├── [id]/page.tsx         # 支付确认页
│   │   └── lookup/page.tsx       # 报名查询
│   ├── admin/
│   │   ├── login/page.tsx        # 管理员登录
│   │   └── (protected)/          # 管理后台（需认证）
│   │       ├── page.tsx          # 仪表盘
│   │       └── events/           # 赛事 CRUD
│   └── runner/
│       ├── login/page.tsx        # 选手登录
│       ├── register/page.tsx     # 选手注册
│       └── my-registrations/     # 我的报名
├── components/
│   ├── SiteHeader.tsx            # 全局导航栏（含用户状态）
│   ├── HeroSection.tsx           # 首页 Hero Banner
│   └── RegistrationForm.tsx      # 报名表单组件
└── lib/
    ├── prisma.ts                 # Prisma 客户端单例
    ├── db.ts                     # 数据库查询函数
    ├── admin-auth.ts             # 管理员认证（Cookie 读写）
    ├── runner-auth.ts            # 选手认证（hash/verify/session）
    ├── constants.ts              # 常量与 Cookie 名称
    └── format.ts                 # 格式化工具函数
prisma/
├── schema.prisma                 # 数据模型
seed.ts                           # 种子数据脚本
```

## 数据模型

| 模型 | 说明 |
|---|---|
| `Event` | 赛事 — 标题、城市、地点、报名时间、状态 |
| `Schedule` | 赛程 — 距离、起跑时间、关门时间、容量 |
| `Group` | 组别 — 按性别/年龄分组的报名组，含费用 |
| `Runner` | 选手 — 手机号（唯一）、密码（scrypt 哈希）、个人资料 |
| `Registration` | 报名记录 — 关联赛事、组别、选手，含紧急联系人 |

## 本地部署

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

在项目根目录创建 `.env` 文件：

```
DATABASE_URL="file:./dev.db"
ADMIN_SECRET="你选择的管理密钥"
```

`ADMIN_SECRET` 用于管理后台登录，是一个共享密钥，**非生产级安全方案**，仅用于原型演示。

### 3. 初始化数据库

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

种子数据包含 2 个赛事（济南半马、青岛校园跑）和 2 个测试选手账号：

| 姓名 | 手机号 | 密码 | 学校 |
|---|---|---|---|
| 张明 | 13800138001 | 123456 | 山东大学 |
| 李婷 | 13800138002 | 123456 | 山东师范大学 |

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

- 管理后台入口：`/admin`，使用 `.env` 中配置的 `ADMIN_SECRET` 登录
- 选手登录入口：`/runner/login`

## 其他命令

```bash
npm run build        # 生产构建
npm run start        # 启动生产服务器（需先执行 build）
npm run lint         # 代码检查
npx prisma studio    # 可视化查看/编辑数据库
npx prisma db push   # 同步 schema 到数据库（不生成迁移文件）
npx prisma db seed   # 重新填充种子数据
```
