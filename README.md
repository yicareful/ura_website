# URA — 山东省大学生长跑赛事平台

山东省大学生长跑 IP 赛事官方报名与管理平台。当前版本实现了选手认证（注册/登录）、赛事报名闭环（浏览赛事 → 查看详情 → 实名报名 → 模拟支付 → 查询状态）、选手个人中心（我的赛事、资料与密码编辑）、完赛证书（按赛事定制的专属模板 \+ 模拟成绩），以及管理后台（赛事管理、报名名册）。

抽签系统、真实支付网关、实名认证、发票、真实计时/成绩系统等功能为后续阶段规划，当前版本暂未实现。完赛证书上的成绩为按报名编号确定性生成的**模拟数据**，待计时系统接入后替换。

## 视觉识别

围绕长跑赛事自身的视觉语言（发令枪、号码布、终点计时牌、赛道标线）建立一套「赛车计时板 / Chrono」美学：

- **主色**：`#0B0D10` 深冷沥青（深色底）/ `#F1F2EC` 暖白纸面（浅色底）/ `#E11D2E` 赛旗红（主色）/ `#15B4C6` 计时器青（数据强调）/ `#F2C84B` 旗帜黄（克制使用）
- **字体**：Barlow Condensed（标题，含斜体 700/800，传达速度感）+ IBM Plex Mono（眉标/数据/标签，等宽计时屏气质）+ Noto Sans SC（中文正文），通过 Google Fonts 引入
- **签名元素**：`clip-path` 斜切角（号码布 / 速度箭头）贯穿卡片、表单与认证卡片；Hero 背景巨型半透明斜体 `URA` 幽灵字 + 斜向终点带条纹
- **质感**：近无圆角（2–4px 仪器精度感）、按钮硬偏移阴影 `6px 6px 0`（hover 前推、按下回弹）、表格表头深底 + 红色下边线呈等宽大写出发名单/计时板风

## 技术栈

- **框架**：Next.js 15（App Router）+ React 19，Server Components 负责数据展示，Server Actions 负责表单提交与数据变更
- **数据库**：SQLite + Prisma ORM 6
- **认证**:Cookie + scrypt 哈希（Node.js `crypto` 内置模块），手机号 + 密码登录
- **样式**:手写 CSS 自定义属性（设计系统变量），不依赖 Tailwind
- **字体**:Barlow Condensed（标题）+ IBM Plex Mono（数据）+ Noto Sans SC（正文），通过 Google Fonts 引入
- **语言**:TypeScript

## 功能模块

### 前端页面

| 路由 | 说明 |
|---|---|
| `/` | 首页 — Hero 大图、赛事推荐、统计数字 |
| `/events` | 赛事列表页 |
| `/events/[id]` | 赛事详情页（已完赛 + 当前选手已完赛时显示完赛证书入口） |
| `/events/[id]/register` | 报名页（需登录） |
| `/registration/[id]` | 报名成功 / 支付确认页（已完赛 + 已支付时显示完赛证书入口） |
| `/registration/[id]/certificate` | 完赛证书（按赛事专属模板渲染，含模拟成绩，可打印 / 另存 PDF） |
| `/registration/lookup` | 报名查询（按身份证号 + 手机号） |
| `/runner/login` | 选手登录 |
| `/runner/register` | 选手注册（手机号 + 密码 + 个人信息） |
| `/runner/my-registrations` | 我的赛事（登录后可见） |
| `/runner/profile` | 个人信息（只读查看） |
| `/runner/profile/edit` | 编辑入口（跳转修改邮箱 / 密码） |
| `/runner/profile/edit/email` | 修改邮箱（验证当前密码） |
| `/runner/profile/edit/password` | 修改密码（验证当前密码） |
| `/admin/login` | 管理后台登录 |
| `/admin` | 管理后台仪表盘 |
| `/admin/events` | 赛事管理列表 |
| `/admin/events/new` | 创建新赛事 |
| `/admin/events/[id]` | 赛事概览 |
| `/admin/events/[id]/edit` | 编辑赛事 |
| `/admin/events/[id]/registrations` | 报名名册 |

### 认证体系

- **管理员**:共享密钥登录（`ADMIN_SECRET`），通过 Cookie 维持会话
- **选手**:手机号 + 密码注册/登录，密码使用 scrypt 加盐哈希存储，Cookie `ura_runner_session`（7 天有效期）
- **报名守卫**:报名赛事前必须登录，登录后自动预填选手个人信息
- **个人中心**:登录后右上角名为「学校 · 姓名」的徽章，鼠标悬停弹出下拉菜单 —「我的赛事」「个人信息」为常规项，底部「退出」用红色强调

### 完赛证书

赛事 `status` 为 `finished` 且对应报名 `status` 为 `paid` 时，证书方可领取与查看：

- 进入**赛事详情页**时，已完赛且登录选手有已支付报名 → 出现「你已完赛」证书卡片入口
- 进入**我的赛事**点进对应报名详情 → 出现「该赛事已完赛 · 查看完赛证书」入口
- 证书**不再与系统强耦合**：每场赛事可拥有自己的证书模板（背景与展示信息量各不相同），系统按 `Event.slug` 在模板注册表中匹配，命不中则回退到通用默认模板。新增一场赛事的证书 = 新增一个模板文件 + 注册一行。
- 选手姓名与组别等随报名变化，其余版面统一；点击「打印 / 保存为 PDF」调用浏览器打印，样式已针对打印优化

- 模板与背景由赛事自行决定，系统只负责组装数据（报名 + 赛事 + 组别 + 模拟成绩）并按 `slug` 选择模板渲染，模板之间互不依赖。
- **通用默认模板**（`DefaultCertificate`）：经典 chrono 证书 —— 顶部三色信号条、巨型斜体 `URA` 幽灵字、红色双圈官印、4 格计时板（距离 / 净计时 / 平均配速 / 终点冲线）。
- **济南半程马拉松专属模板**（`JinanHalfCertificate`，`slug = jinan-half-marathon-2026`）：暖象牙纸面 + 九曲黄河主题背景 —— 一条九曲黄河以金/青渐变斜贯纸面、沿岸标记九处弯道节点、在河道弯折处绘「黄河体育中心」涟漪明珠、两端标注「现在 / 未来」暗喻这场穿越之旅；正文融入鹊华新区、黄河新城与「九曲黄河」理念，金色双圈官印记「URA · 九曲黄河」。

#### 模板注册表

`src/components/certificates/index.ts` 维护 `slug -> 模板组件` 的映射：

```ts
const CERTIFICATE_TEMPLATES: Record<string, CertificateTemplate> = {
  "jinan-half-marathon-2026": JinanHalfCertificate,
  // 新赛事：在此登记一个专属模板
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
│   ├── page.tsx                  # 首页
│   ├── layout.tsx                # 根布局（字体加载）
│   ├── globals.css               # 全局样式与设计系统变量
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
│   ├── admin/
│   │   ├── login/                # 管理员登录
│   │   └── (protected)/          # 管理后台（需认证）
│   │       ├── page.tsx          # 仪表盘
│   │       └── events/           # 赛事 CRUD
│   └── runner/
│       ├── login/                # 选手登录
│       ├── register/             # 选手注册
│       ├── my-registrations/     # 我的赛事
│       └── profile/
│           ├── page.tsx          # 个人信息
│           └── edit/             # 编辑邮箱 / 密码
├── components/
│   ├── SiteHeader.tsx            # 全局导航栏（用户状态 + 悬停下拉菜单）
│   ├── HeroSection.tsx           # 首页 Hero Banner
│   ├── EventCard.tsx             # 赛事卡片（号码布序号 + 斜切角）
│   ├── GroupTable.tsx            # 报名组别表格（起跑名单风）
│   ├── RegistrationForm.tsx      # 报名表单组件
│   ├── StatusBadge.tsx           # 赛事 / 报名状态徽章
│   ├── CountUp.tsx               # 数字滚动动画（客户端）
│   ├── AdminSidebar.tsx          # 管理后台侧边栏
│   └── certificates/                # 完赛证书模板（与系统解耦）
│       ├── index.ts                 # slug -> 模板 注册表 + 默认回退
│       ├── types.ts                # 统一证书数据类型 CertificateData
│       ├── DefaultCertificate.tsx   # 通用默认证书模板
│       └── JinanHalfCertificate.tsx # 济南半马专属模板（九曲黄河主题）
└── lib/
    ├── prisma.ts                 # Prisma 客户端单例
    ├── db.ts                     # 数据库查询函数
    ├── admin-auth.ts             # 管理员认证（Cookie 读写）
    ├── runner-auth.ts            # 选手认证（hash/verify/session）
    ├── certificate.ts            # 完赛证书：模拟成绩 + 时间格式化
    ├── constants.ts              # 常量、Cookie 名称、状态标签
    └── format.ts                 # 费用 / 日期 / 年龄区间格式化
prisma/
├── schema.prisma                 # 数据模型
seed.ts                           # 种子数据脚本
```

## 数据模型

| 模型 | 说明 |
|---|---|
| `Event` | 赛事 — 标题、城市、地点、报名时间、状态（draft / open / closed / finished） |
| `Group` | 组别 — 按性别 / 年龄分组的报名组，含距离、起跑 / 关门时间、容量、费用（单位：分） |
| `Runner` | 选手 — 手机号（唯一）、密码（scrypt 哈希）、个人资料、sessionToken |
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
```

`ADMIN_SECRET` 用于管理后台登录，是一个共享密钥，**非生产级安全方案**,仅用于原型演示。

### 3. 初始化数据库

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

种子数据包含 2 个赛事（济南半程马拉松、青岛校园跑）和 2 个测试选手账号：

| 姓名 | 手机号 | 密码 | 学校 | 报名 |
|---|---|---|---|---|
| 张明 | 13800138001 | 123456 | 山东大学 | 济南男半马 · 已支付 |
| 李婷 | 13800138002 | 123456 | 山东师范大学 | 济南女半马 · 待支付 |

> 数据库当前演示状态：济南半程马拉松已置为 `finished`，可用张明账号登录后从「我的赛事 → 报名详情」领取完赛证书。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

- 管理后台入口:`/admin`，使用 `.env` 中配置的 `ADMIN_SECRET` 登录
- 选手登录入口:`/runner/login`

## 其他命令

```bash
npm run build        # 生产构建
npm run start        # 启动生产服务器（需先执行 build）
npm run lint         # 代码检查
npx prisma studio    # 可视化查看 / 编辑数据库
npx prisma db push   # 同步 schema 到数据库（不生成迁移文件）
npx prisma db seed   # 重新填充种子数据
```