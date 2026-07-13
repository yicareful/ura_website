# URA — 山东省大学生长跑赛事平台

山东省大学生长跑 IP 赛事官方报名与管理平台。当前版本实现了：

- **选手认证**：手机号短信验证码注册 / 登录（两步注册：验证手机号 → 完善资料），兼保留密码登录
- **URA 选手编号**：每位注册选手自动分配唯一 5 位 URA ID，作为跨赛事的选手身份凭证
- **赛事报名闭环**：浏览赛事 → 查看详情 → 实名报名 → 模拟支付 → 查询状态
- **选手个人中心**：我的赛事、资料与密码编辑
- **完赛证书**：按赛事定制的专属模板 + 模拟成绩，可打印 / 另存 PDF
- **管理后台**：赛事管理（CRUD）、报名名册
- **新闻模块**：平台动态、人物专访、赛事资讯三大栏目，首页新闻区块 + 新闻中心 + 文章详情页

抽签系统、真实支付网关、实名认证、发票、真实计时 / 成绩系统、真实短信网关对接（当前为开发模拟）等功能为后续阶段规划，当前版本暂未完整实现。完赛证书上的成绩为按报名编号确定性生成的**模拟数据**，待计时系统接入后替换。

## 视觉识别

围绕长跑赛事自身的视觉语言（发令枪、号码布、终点计时牌、赛道标线）建立一套「赛车计时板 / Chrono」美学：

- **主色**：`#0B0D10` 深冷沥青（深色底）/ `#F1F2EC` 暖白纸面（浅色底）/ `#E11D2E` 赛旗红（主色）/ `#15B4C6` 计时器青（数据强调）/ `#F2C84B` 旗帜黄（克制使用）
- **字体**：Barlow Condensed（标题，含斜体 700/800，传达速度感）+ IBM Plex Mono（眉标 / 数据 / 标签，等宽计时屏气质）+ Noto Sans SC（中文正文），通过 Google Fonts 引入
- **签名元素**：`clip-path` 斜切角（号码布 / 速度箭头）贯穿卡片、表单与认证卡片；Hero 背景巨型半透明斜体 `URA` 幽灵字 + 斜向终点带条纹
- **质感**：近无圆角（2–4px 仪器精度感）、按钮硬偏移阴影 `6px 6px 0`（hover 前推、按下回弹）、表格表头深底 + 红色下边线呈等宽大写出发名单 / 计时板风

## 技术栈

- **框架**：Next.js 15（App Router）+ React 19，Server Components 负责数据展示，Server Actions 负责表单提交与数据变更，Route Handlers 负责短信验证码 API
- **数据库**：SQLite + Prisma ORM 6
- **缓存 / 验证码存储**：Redis（ioredis），用于短信验证码存取、发送频率限制与注册临时令牌
- **短信服务**：阿里云短信（`@alicloud/dysmsapi20170525`），未配置时自动回退为开发控制台输出
- **认证**：Cookie + scrypt 哈希（Node.js `crypto` 内置模块），手机号 + 短信验证码为主、密码登录为辅
- **样式**：手写 CSS 自定义属性（设计系统变量），不依赖 Tailwind
- **字体**：Barlow Condensed（标题）+ IBM Plex Mono（数据）+ Noto Sans SC（正文），通过 Google Fonts 引入
- **语言**：TypeScript

## 功能模块

### 前端页面

| 路由 | 说明 |
|---|---|
| `/` | 首页 — Hero 大图、赛事推荐、统计数字、新闻区块 |
| `/events` | 赛事列表页 |
| `/events/[id]` | 赛事详情页（已完赛 + 当前选手已完赛时显示完赛证书入口） |
| `/events/[id]/register` | 报名页（需登录） |
| `/registration/[id]` | 报名成功 / 支付确认页（已完赛 + 已支付时显示完赛证书入口） |
| `/registration/[id]/certificate` | 完赛证书（按赛事专属模板渲染，含模拟成绩，可打印 / 另存 PDF） |
| `/registration/lookup` | 报名查询（按身份证号 + 手机号） |
| `/runner/login` | 选手登录（验证码登录 / 密码登录双 Tab） |
| `/runner/register` | 选手注册 · 第一步：手机号短信验证码验证 |
| `/runner/register/profile` | 选手注册 · 第二步：完善个人资料（凭临时令牌进入） |
| `/runner/my-registrations` | 我的赛事（登录后可见） |
| `/runner/profile` | 个人信息（只读查看，含 URA ID） |
| `/runner/profile/edit` | 编辑入口（跳转修改邮箱 / 密码） |
| `/runner/profile/edit/email` | 修改邮箱（验证当前密码） |
| `/runner/profile/edit/password` | 修改密码（验证当前密码） |
| `/news` | 新闻中心 — 按栏目（平台动态 / 专访 / 赛事资讯）过滤的文章列表 |
| `/news/[slug]` | 文章详情页（正文 + 同栏目相关推荐） |
| `/admin/login` | 管理后台登录 |
| `/admin` | 管理后台仪表盘 |
| `/admin/events` | 赛事管理列表 |
| `/admin/events/new` | 创建新赛事 |
| `/admin/events/[id]` | 赛事概览 |
| `/admin/events/[id]/edit` | 编辑赛事 |
| `/admin/events/[id]/registrations` | 报名名册 |

### API 路由

| 路由 | 方法 | 说明 |
|---|---|---|
| `/api/auth/send-code` | POST | 发送短信验证码（60 秒频率限制，验证码存入 Redis，5 分钟过期） |
| `/api/auth/verify-code` | POST | 校验验证码：已注册 → 自动登录；未注册 → 返回注册临时令牌跳转完善资料 |

### 认证体系

- **管理员**：共享密钥登录（`ADMIN_SECRET`），通过 Cookie 维持会话
- **选手注册（两步）**：
  1. `/runner/register` 输入手机号 → 调用 `/api/auth/send-code` 发送验证码 → 调用 `/api/auth/verify-code` 校验
  2. 校验通过：手机号已注册则直接登录跳首页；未注册则返回临时令牌，跳转 `/runner/register/profile` 完善姓名、性别、身份证、学校、密码等信息后创建账号
- **选手登录**：`/runner/login` 提供双 Tab —— 验证码登录（默认，流程同上）与密码登录（手机号 + 密码，Server Action）
- **密码存储**：scrypt 加盐哈希；Cookie `ura_runner_session`（7 天有效期，httpOnly）
- **URA 选手编号**：注册时自动生成唯一 5 位随机编号（10000–99999），用户不可更改，并发冲突时自动重试，显示在个人中心与名册中
- **报名守卫**：报名赛事前必须登录，登录后自动预填选手个人信息
- **个人中心**：登录后右上角名为「学校 · 姓名」的徽章，鼠标悬停弹出下拉菜单 —「我的赛事」「个人信息」为常规项，底部含 URA ID 显示与「退出」（红色强调）

### 新闻模块

三大栏目，数据为模拟内容（位于 `src/lib/news-data.ts`，按 `NewsArticle` 结构组织，正文支持段落 / 小标题 / 引用 / 列表 / 数据表五种块）：

| 栏目 | 内容 |
|---|---|
| 平台动态 | 平台建成公告与已完成功能清单、URA 选手编号体系启用 |
| 专访 | 高校运动员访谈（如清华大学中长跑运动员王文杰） |
| 赛事资讯 | 近期越野 / 路跑赛事前瞻与备战指南（如 2026 崇礼 168 越野赛） |

- **首页**底部 `NewsSection`：栏目分类条（带计数）+ 头条精选卡片 + 紧凑卡片网格
- **新闻中心** `/news`：支持 `?cat=platform|interview|race` 按栏目过滤，按时间倒序
- **文章详情** `/news/[slug]`：深色 hero + 正文 + 返回与同栏目相关推荐

### 完赛证书

赛事 `status` 为 `finished` 且对应报名 `status` 为 `paid` 时，证书方可领取与查看：

- 进入**赛事详情页**时，已完赛且登录选手有已支付报名 → 出现「你已完赛」证书卡片入口
- 进入**我的赛事**点进对应报名详情 → 出现「该赛事已完赛 · 查看完赛证书」入口
- 证书**与系统解耦**：每场赛事可拥有自己的证书模板（背景与展示信息量各不相同），系统按 `Event.slug` 在模板注册表中匹配，命不中则回退到通用默认模板。新增一场赛事的证书 = 新增一个模板文件 + 注册一行。
- 选手姓名与组别等随报名变化，其余版面统一；点击「打印 / 保存为 PDF」调用浏览器打印，样式已针对打印优化。

```ts
// src/components/certificates/index.ts
const CERTIFICATE_TEMPLATES: Record<string, CertificateTemplate> = {
  "jinan-half-marathon-2026": JinanHalfCertificate,
};
export function getCertificateTemplate(slug: string): CertificateTemplate {
  return CERTIFICATE_TEMPLATES[slug] ?? DefaultCertificate;
}
```

每个模板接收统一的 `CertificateData`（`src/components/certificates/types.ts`：报名 / 赛事 / 组别 / 模拟成绩 / 签发日期与 BIB），自行决定背景与展示哪些数据，因此证书样式与系统业务层解耦。

#### 模拟成绩

`src/lib/certificate.ts` 在尚无计时系统时，按 `报名编号 + 距离` 哈希、依据距离区间选取真实合理配速，**确定性生成**净计时 / 配速 / 冲线时间 —— 同一报名每次都渲染同一张证书，不同选手成绩不同。例如种子数据中两位选手在济南半程马拉松（21.0975 km，起跑 07:30）的模拟成绩：

| 选手 | 净计时 | 平均配速 | 终点冲线 |
|---|---|---|---|
| 张明（男） | 1:59:39 | 5'40"/km | 09:29:39 |
| 李婷（女） | 2:27:46 | 7'00"/km | 09:57:46 |

## 目录结构

```
src/
├── app/
│   ├── page.tsx                  # 首页（Hero + 赛事 + 新闻区块）
│   ├── layout.tsx                # 根布局（字体加载）
│   ├── globals.css               # 全局样式与设计系统变量
│   ├── api/
│   │   └── auth/
│   │       ├── send-code/route.ts   # 发送短信验证码
│   │       └── verify-code/route.ts # 校验验证码（登录 / 注册分流）
│   ├── events/
│   │   ├── page.tsx              # 赛事列表
│   │   └── [id]/
│   │       ├── page.tsx          # 赛事详情（含完赛证书入口）
│   │       └── register/         # 报名表单 + action
│   ├── registration/
│   │   ├── [id]/
│   │   │   ├── page.tsx          # 支付确认 / 报名详情（含完赛证书入口）
│   │   │   └── certificate/      # 完赛证书页（按 slug 选模板）+ 打印按钮
│   │   └── lookup/               # 报名查询
│   ├── news/
│   │   ├── page.tsx              # 新闻中心（按栏目过滤）
│   │   └── [slug]/page.tsx       # 文章详情
│   ├── admin/
│   │   ├── login/                # 管理员登录
│   │   └── (protected)/          # 管理后台（需认证）
│   │       ├── page.tsx          # 仪表盘
│   │       └── events/           # 赛事 CRUD
│   └── runner/
│       ├── login/                # 选手登录（验证码 / 密码双 Tab）
│       ├── register/
│       │   ├── page.tsx          # 注册第一步：手机号验证码验证
│       │   ├── actions.ts        # （已迁移至 profile/actions.ts，保留占位）
│       │   └── profile/          # 注册第二步：完善资料 + completeProfile action
│       ├── my-registrations/     # 我的赛事
│       └── profile/
│           ├── page.tsx          # 个人信息（含 URA ID）
│           └── edit/             # 编辑邮箱 / 密码
├── components/
│   ├── SiteHeader.tsx            # 全局导航栏（赛事 / 新闻 / 管理后台 + 用户菜单）
│   ├── HeroSection.tsx           # 首页 Hero Banner
│   ├── EventCard.tsx             # 赛事卡片（号码布序号 + 斜切角）
│   ├── NewsSection.tsx           # 首页新闻区块（栏目条 + 精选 + 卡片网格）
│   ├── GroupTable.tsx            # 报名组别表格（起跑名单风）
│   ├── RegistrationForm.tsx      # 报名表单组件
│   ├── Select.tsx                # 自定义下拉选择组件（客户端）
│   ├── StatusBadge.tsx           # 赛事 / 报名状态徽章
│   ├── CountUp.tsx               # 数字滚动动画（客户端）
│   ├── AdminSidebar.tsx          # 管理后台侧边栏
│   └── certificates/             # 完赛证书模板（与系统解耦）
│       ├── index.ts              # slug -> 模板 注册表 + 默认回退
│       ├── types.ts              # 统一证书数据类型 CertificateData
│       ├── DefaultCertificate.tsx   # 通用默认证书模板
│       └── JinanHalfCertificate.tsx # 济南半马专属模板（九曲黄河主题）
└── lib/
    ├── prisma.ts                 # Prisma 客户端单例
    ├── db.ts                     # 数据库查询函数
    ├── redis.ts                  # Redis：验证码存取 / 频率限制 / 注册临时令牌
    ├── sms.ts                    # 阿里云短信发送（未配置时控制台模拟）
    ├── ura-id.ts                 # 唯一 5 位 URA ID 生成
    ├── news-data.ts              # 新闻模块模拟数据与查询函数
    ├── admin-auth.ts             # 管理员认证（Cookie 读写）
    ├── runner-auth.ts            # 选手认证（hash/verify/session）
    ├── certificate.ts            # 完赛证书：模拟成绩 + 时间格式化
    ├── constants.ts              # 常量、Cookie 名称、状态标签
    └── format.ts                 # 费用 / 日期 / 年龄区间格式化
prisma/
├── schema.prisma                 # 数据模型
└── migrations/                   # 迁移文件（init / flatten_groups / add_runner_ura_id）
seed.ts                           # 种子数据脚本
```

## 数据模型

| 模型 | 说明 |
|---|---|
| `Event` | 赛事 — 标题、slug、城市、地点、报名时间、状态（draft / open / closed / finished） |
| `Group` | 组别 — 按性别 / 年龄分组的报名组，含距离、起跑 / 关门时间、容量、费用（单位：分） |
| `Runner` | 选手 — 手机号（唯一）、密码（scrypt 哈希）、URA ID（5 位唯一）、个人资料、sessionToken |
| `Registration` | 报名记录 — 关联赛事、组别、选手，含紧急联系人；唯一约束 `(eventId, groupId, idCard)` |

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

# Redis（短信验证码存储 / 频率限制 / 注册临时令牌）
REDIS_URL=redis://localhost:6379

# 阿里云短信服务（短信验证码）— 留空时自动回退为开发控制台输出
ALI_ACCESS_KEY_ID=
ALI_ACCESS_KEY_SECRET=
ALI_SMS_SIGN=
ALI_SMS_TEMPLATE=
```

说明：

- `ADMIN_SECRET` 用于管理后台登录，是一个共享密钥，**非生产级安全方案**，仅用于原型演示。
- `REDIS_URL` 需要本地运行 Redis 服务；短信验证码登录 / 注册依赖 Redis。
- 阿里云短信四项配置任一为空时，`sendVerificationCode` 会在控制台打印 `[DEV SMS] 验证码 xxx → 手机号`，不实际发送短信，便于本地开发。

### 3. 启动 Redis（本地开发）

```bash
# 方式一：本地安装的 Redis
redis-server

# 方式二：Docker
docker compose up -d redis
```

> 项目根目录提供 `docker-compose.yaml`，可一键启动 Redis。

### 4. 初始化数据库

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

种子数据包含 2 个赛事（济南半程马拉松、青岛校园跑）、6 个组别、2 个测试选手账号与 2 条报名记录：

| 姓名 | 手机号 | 密码 | URA ID | 学校 | 报名 |
|---|---|---|---|---|---|
| 张明 | 13800138001 | 123456 | 13801 | 山东大学 | 济南男半马 · 已支付 |
| 李婷 | 13800138002 | 123456 | 24917 | 山东师范大学 | 济南女半马 · 待支付 |

> 注：种子数据中济南半程马拉松状态为 `open`。如需体验完赛证书流程，可将该赛事 `status` 改为 `finished`（通过管理后台或 `npx prisma studio`），随后用张明账号登录，从「我的赛事 → 报名详情」领取完赛证书。

### 5. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

- 管理后台入口：`/admin`，使用 `.env` 中配置的 `ADMIN_SECRET` 登录
- 选手登录入口：`/runner/login`（验证码登录需 Redis；未配置短信服务时验证码打印在服务端控制台）

## 其他命令

```bash
npm run build        # 生产构建
npm run start        # 启动生产服务器（需先执行 build）
npm run lint         # 代码检查
npx prisma studio    # 可视化查看 / 编辑数据库
npx prisma db push   # 同步 schema 到数据库（不生成迁移文件）
npx prisma db seed   # 重新填充种子数据
npx prisma generate  # 重新生成 Prisma Client
```
