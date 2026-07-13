// 新闻模块模拟数据
// 三大栏目：平台动态 / 专访 / 赛事资讯

export type NewsCategory = "platform" | "interview" | "race";

export const NEWS_CATEGORIES: { id: NewsCategory; label: string; labelEn: string; accent: string }[] = [
  { id: "platform", label: "平台动态", labelEn: "PLATFORM", accent: "var(--color-red)" },
  { id: "interview", label: "专访", labelEn: "INTERVIEW", accent: "var(--color-blue)" },
  { id: "race", label: "赛事资讯", labelEn: "RACE WIRE", accent: "var(--color-yellow)" },
];

export type NewsParagraph =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "quote"; text: string; cite?: string }
  | { type: "list"; items: string[] }
  | { type: "data"; rows: { label: string; value: string }[] };

export interface NewsArticle {
  slug: string;
  category: NewsCategory;
  title: string;
  subtitle?: string;
  date: string; // ISO
  author?: string;
  readMinutes: number;
  excerpt: string;
  cover: { tag: string; meta: string };
  body: NewsParagraph[];
  featured?: boolean;
}

export const NEWS_ARTICLES: NewsArticle[] = [
  // ───────────── 平台动态 ─────────────
  {
    slug: "ura-platform-launch-20260707",
    category: "platform",
    title: "URA 赛事平台正式上线",
    subtitle: "7 月 7 日建成，面向山东高校长跑赛事的一体化报名与运营系统",
    date: "2026-07-07T09:00:00+08:00",
    author: "URA 编辑部",
    readMinutes: 3,
    excerpt:
      "URA（University Race Administration）于 2026 年 7 月 7 日完成搭建并正式上线。平台以「报名—名册—选手中心」为主线，目前核心功能已全部就绪。",
    cover: { tag: "平台动态 / PLATFORM", meta: "2026.07.07 · 上线公告" },
    featured: true,
    body: [
      { type: "p", text: "2026 年 7 月 7 日，URA 山东省大学生长跑赛事平台完成搭建并正式上线。我们希望把每一次报名接入同一条赛道——选手从浏览赛事到完成报名，运营者从发布赛事到管理名册，都在同一套节奏里推进。" },
      { type: "h", text: "目前已完成的功能" },
      { type: "p", text: "截至本公告发布，平台第一阶段的全部核心模块均已开发完成并开放使用：" },
      {
        type: "list",
        items: [
          "赛事发布与管理：支持多组别、距离与名额配置，开放报名、截止、结束全状态流转。",
          "选手报名：在线选择组别、填写信息并完成支付，报名记录实时进入赛事名册。",
          "URA 选手 ID：每位注册选手获得唯一 5 位 URA 编号，作为跨赛事的选手身份凭证。",
          "选手中心：个人资料维护、邮箱与密码修改、我的赛事报名记录一站式查看。",
          "短信验证码登录：基于手机号的快捷登录与身份核验。",
          "电子完赛证书：自动生成可在线预览、打印的完赛证书，按赛事模板渲染。",
          "报名查询：凭报名信息自助查验报名状态与证书。",
          "管理后台：赛事、报名、组别名册的集中管理，管理员账号体系。",
        ],
      },
      { type: "h", text: "接下来的方向" },
      { type: "p", text: "第一阶段我们打通了「发布—报名—名册—证书」的完整闭环。下一阶段将围绕成绩录入、排名与数据看板、团队 / 团体报名、以及更丰富的证书模板继续迭代。" },
      { type: "quote", text: "把繁琐的赛事运营收进一套干净的节奏里，是 URA 的出发点。", cite: "URA 编辑部" },
      { type: "p", text: "感谢首批接入的高校与赛事运营伙伴。更多赛事正在陆续接入，敬请关注「赛事资讯」栏目。" },
    ],
  },
  {
    slug: "ura-runner-id-system",
    category: "platform",
    title: "URA 选手编号体系启用",
    subtitle: "5 位编号，跨赛事的选手身份凭证",
    date: "2026-07-10T10:00:00+08:00",
    author: "URA 编辑部",
    readMinutes: 2,
    excerpt:
      "平台已启用统一 URA 选手编号，5 位数字、一人一号，贯穿该选手在平台上的所有报名与完赛记录。",
    cover: { tag: "平台动态 / PLATFORM", meta: "2026.07.10 · 功能更新" },
    body: [
      { type: "p", text: "自 7 月 10 日起，平台为每位完成注册的选手分配唯一 URA 编号，以 5 位数字呈现（如 00001）。该编号与选手手机号绑定，作为跨赛事的身份凭证。" },
      { type: "list", items: [
        "一人一号：同一选手在平台所有赛事中沿用同一 URA 编号。",
        "名册呈现：报名记录与电子证书均带编号显示。",
        "选手中心：登录后可在个人信息页查看自己的 URA 编号。",
      ] },
      { type: "p", text: "编号体系是后续成绩档案与选手数据看板的基础，我们将在第二阶段逐步展开。" },
    ],
  },

  // ───────────── 专访 ─────────────
  {
    slug: "interview-wang-wenjie-tsinghua-1500m",
    category: "interview",
    title: "专访王文杰：把 1500 米跑成一道思考题",
    subtitle: "清华大学中长跑运动员谈冬训、节奏感与高校竞技的当下",
    date: "2026-07-11T14:00:00+08:00",
    author: "URA 专访组",
    readMinutes: 7,
    excerpt:
      "作为清华大学中长跑队的主力之一，王文杰在 1500 米与更长距离上持续打磨自己的节奏。我们和他聊了冬训储备、比赛中的决策，以及他对高校长跑生态的看法。",
    cover: { tag: "专访 / INTERVIEW", meta: "2026.07.11 · 清华大学" },
    featured: true,
    body: [
      { type: "p", text: "夏训的清华操场热得很早。我们在跑道边见到王文杰时，他刚结束一组间歇，正在做放松慢跑。1500 米是他最熟悉的距离，但聊起来，他更愿意谈「节奏」而不是「配速」。" },
      { type: "h", text: "「1500 米更像一道思考题」" },
      { type: "quote", text: "1500 米不是一上来就拼，它更像一道思考题——你要在 3 分多钟里不停地做决策：什么时候跟、什么时候顶、最后一圈还要不要留。", cite: "王文杰" },
      { type: "p", text: "王文杰说，1500 米的难点不在某一段，而在段与段之间的衔接。前 800 米要稳，第三圈是分水岭，最后 300 米是纯粹意志力的较量。他把训练分成两块：一块是能力储备，一块是节奏模拟。" },
      { type: "h", text: "冬训：把「油箱」做大" },
      { type: "p", text: "刚过去的冬训，他强调的不是速度，而是「把油箱做大」。「冬训多在有氧和阈值区间里磨，基础打厚了，到了赛季才能在上面叠加速度。如果冬天偷懒，夏天比赛里一定会还回来。」" },
      {
        type: "list",
        items: [
          "有氧跑：晨跑与长距离慢跑为主，打底有氧储备。",
          "阈值与节奏：长间歇按目标比赛配速切分，培养体感。",
          "速度与力量：短间歇与场地冲刺收尾，保留末段冲刺能力。",
        ],
      },
      { type: "h", text: "比赛中如何做决策" },
      { type: "p", text: "谈到比赛日的策略，王文杰反复提到「不被带乱节奏」。「起跑经常有人冲得很凶，但前 400 米快几秒，对 1500 米来说往往是负面的。我会盯自己的分段，谁冲谁冲，我按计划走。」" },
      { type: "quote", text: "我相信节奏感是可以训练的——你在训练里反复经过那个点，比赛里身体就会自己认路。", cite: "王文杰" },
      { type: "p", text: "他举例，第三圈往往是「最难受的一段」，心率拉到高位、乳酸堆积，很多选手会在这里掉速。他的应对是在训练里专门模拟这一段：「我会刻意把第三圈的强度顶起来，让身体习惯在这个状态下还保持技术。」" },
      { type: "h", text: "关于高校长跑的生态" },
      { type: "p", text: "作为高校运动员，王文杰也谈了对当下高校长跑环境的观察。「这几年高校长跑整体在往上走，比赛多了，水平也高了。但学生运动员最大的挑战是平衡——训练、学业、恢复三角里，恢复最容易被忽略。」" },
      { type: "p", text: "他特别提到睡眠与营养的重要性：「训练只是刺激，真正变强是在恢复里完成的。睡不够、吃不好，训练质量会打折扣。」" },
      { type: "h", text: "接下来的目标" },
      { type: "p", text: "对于接下来的赛季，王文杰没有把话说满。「想先把冬训的储备转化成比赛里的稳定发挥，再去冲击更好的成绩。一步一个脚印，比一次性说大目标更靠谱。」" },
      { type: "quote", text: "跑步教会我最重要的一件事是：慢一点没关系，但别停。", cite: "王文杰" },
      { type: "p", text: "采访结束，他又回到跑道，开始下一组。操场很热，但他的节奏一点没乱。" },
    ],
  },

  // ───────────── 赛事资讯 ─────────────
  {
    slug: "chongli-168-2026-preview",
    category: "race",
    title: "2026 崇礼 168 越野赛前瞻：云端之上的百英里盛宴",
    subtitle: "8 月崇礼开跑，168K / 130K / 100K / 50K 等多组别全面升级",
    date: "2026-07-12T09:30:00+08:00",
    author: "URA 赛事资讯",
    readMinutes: 5,
    excerpt:
      "2026 崇礼 168 越野赛将于 8 月在河北崇礼鸣枪。作为国内最具标志性的超长距离越野赛事之一，本届赛道、组别与保障全面升级，报名通道已开启。",
    cover: { tag: "赛事资讯 / RACE WIRE", meta: "2026.07.12 · 崇礼前瞻" },
    featured: true,
    body: [
      { type: "p", text: "2026 崇礼 168 越野赛（Chongli 168）将于 8 月在河北省张家口市崇礼区开赛。依托冬奥赛道与亚高原山地地形，崇礼 168 已成为中国越野跑版图上最具代表性的百英里赛事之一。" },
      { type: "h", text: "赛事概况" },
      {
        type: "data",
        rows: [
          { label: "赛事名称", value: "2026 崇礼 168 越野赛" },
          { label: "比赛时间", value: "2026 年 8 月" },
          { label: "比赛地点", value: "河北省张家口市崇礼区" },
          { label: "赛事性质", value: "超长距离山地越野赛（UTMB® 指数认证）" },
          { label: "主组别", value: "168K / 130K / 100K / 50K / 30K 等多组别" },
        ],
      },
      { type: "h", text: "赛道与地形" },
      { type: "p", text: "崇礼地处北纬 40° 的亚高原山地，海拔在 1300–2100 米之间，森林覆盖率极高。168K 组别累计爬升超过 9000 米，穿越多条冬奥雪场赛道与高山草甸，被选手形容为「云端之上的百英里」。" },
      { type: "p", text: "本届赛道在往届基础上对补给点位置与下撤通道进行了优化，强化了夜间路段的标识与救援节点布设，提升长距离组别的安全冗余。" },
      { type: "h", text: "组别设置" },
      {
        type: "list",
        items: [
          "168K：旗舰组别，百英里级挑战，关门时间约 42 小时。",
          "130K：百公里进阶组别，适合有 100K 基础的选手。",
          "100K：经典百公里，UTMB® 指数获取的热门组别。",
          "50K：长距离越野入门，适合公路马拉松转向越野的跑者。",
          "30K：短距离体验组别，覆盖更广泛的户外爱好者。",
        ],
      },
      { type: "h", text: "参赛与报名" },
      { type: "p", text: "赛事采用资质审核制，168K / 130K / 100K 组别需提交过往越野赛完赛成绩作为参赛资格依据。报名通过赛事官方通道进行，名额采用先到先得与抽签结合的方式。" },
      { type: "quote", text: "崇礼 168 想做的不是一场最难的比赛，而是一场让更多人在自己的边界上完成挑战的百英里。", cite: "赛事组委会" },
      { type: "h", text: "保障与可持续" },
      { type: "p", text: "赛事在保障层面延续了高规格：赛道沿途设有多级补给与医疗点，配备专业山地救援团队与通信保障；同时持续推进「无痕越野」计划，强调生态保护与赛后环境恢复。" },
      { type: "p", text: "8 月的崇礼，气温适宜、星空通透。无论你是冲击百英里的老手，还是第一次走向山野的新人，崇礼 168 都提供了一条适合你边界线的赛道。" },
      { type: "p", text: "更多组别详情、报名要求与赛程安排，请关注赛事官方后续公告。URA 资讯频道将持续跟踪报道。" },
    ],
  },
  {
    slug: "chongli-168-2026-training-notes",
    category: "race",
    title: "备战崇礼 168：最后 4 周的越野训练要点",
    subtitle: "长距离、垂直爬升与下坡技术——赛前最后阶段怎么练",
    date: "2026-07-13T08:00:00+08:00",
    author: "URA 赛事资讯",
    readMinutes: 4,
    excerpt:
      "距离 2026 崇礼 168 开赛还有约 4 周，长距离 LSD、累计爬升与下坡技术是这一阶段的三条主线。",
    cover: { tag: "赛事资讯 / RACE WIRE", meta: "2026.07.13 · 备战指南" },
    body: [
      { type: "p", text: "进入赛前最后 4 周，训练的总体原则是「保持而不冒进」——这一阶段提升空间有限，更大的风险是过度训练导致伤病。把状态调到比赛日，比临时加量更重要。" },
      { type: "h", text: "长距离耐力" },
      { type: "p", text: "保留一次长距离 LSD，时间控制在 4–6 小时，以低心率有氧为主，模拟比赛后期的疲劳状态与补给流程。这是赛前最后一次长距离实战演练。" },
      { type: "h", text: "垂直爬升" },
      { type: "p", text: "每周保留一次累计爬升 1500 米以上的训练，可以选择台阶、缓坡重复或山地往返。重点不是速度，而是上坡时的步态效率与心率控制。" },
      { type: "h", text: "下坡技术" },
      { type: "p", text: "下坡是越野赛里最容易积累损伤的环节。赛前可做短距离的下坡技术练习：小步幅、高步频、重心略前倾，减少对股四头肌的冲击。" },
      {
        type: "list",
        items: [
          "装备磨合：赛前完成比赛鞋、背包、手杖的最终磨合。",
          "补给演练：在长距离中复用比赛日的补给方案。",
          "减量安排：最后 10–14 天逐步减量，保持频率、降低总量。",
        ],
      },
      { type: "p", text: "崇礼的亚高原海拔会带来一定的心率上扬，比赛日不要硬顶目标配速，按体感与心率走，把节奏留给后半程。" },
    ],
  },
];

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return NEWS_ARTICLES.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: NewsCategory): NewsArticle[] {
  return NEWS_ARTICLES.filter((a) => a.category === category);
}

export function getFeaturedArticles(): NewsArticle[] {
  return NEWS_ARTICLES.filter((a) => a.featured);
}

export function getLatestArticles(limit?: number): NewsArticle[] {
  const sorted = [...NEWS_ARTICLES].sort((a, b) => +new Date(b.date) - +new Date(a.date));
  return limit ? sorted.slice(0, limit) : sorted;
}
