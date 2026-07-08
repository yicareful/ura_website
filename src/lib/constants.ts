export const REGISTRATION_STATUS = {
  PENDING_PAYMENT: "pending_payment",
  PAID: "paid",
  CANCELLED: "cancelled",
} as const;

export const REGISTRATION_STATUS_LABEL: Record<string, string> = {
  pending_payment: "待支付",
  paid: "已支付",
  cancelled: "已取消",
};

export const EVENT_STATUS = {
  DRAFT: "draft",
  OPEN: "open",
  CLOSED: "closed",
  FINISHED: "finished",
} as const;

export const EVENT_STATUS_LABEL: Record<string, string> = {
  draft: "待发布",
  open: "报名中",
  closed: "报名截止",
  finished: "已结束",
};

export const GENDER_LABEL: Record<string, string> = {
  male: "男",
  female: "女",
  all: "不限",
};

export const ADMIN_SESSION_COOKIE = "ura_admin_session";
export const RUNNER_SESSION_COOKIE = "ura_runner_session";
