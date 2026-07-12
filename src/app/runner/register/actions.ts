"use server";

// 注册流程已改为两步：
// 第一步：验证手机号（在 register/page.tsx 通过 API 完成）
// 第二步：完善资料（在 register/profile/page.tsx 通过 completeProfile 完成）
//
// 这个文件保留为空，原有逻辑已迁移到 profile/actions.ts

export {};
