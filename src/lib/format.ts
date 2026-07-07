export function formatFee(feeInCents: number) {
  return `¥${(feeInCents / 100).toFixed(0)}`;
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatAgeRange(minAge?: number | null, maxAge?: number | null) {
  if (!minAge && !maxAge) return "不限年龄";
  if (minAge && maxAge) return `${minAge}-${maxAge}岁`;
  if (minAge) return `${minAge}岁以上`;
  return `${maxAge}岁以下`;
}
