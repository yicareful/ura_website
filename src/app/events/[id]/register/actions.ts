"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { findExistingRegistration, getGroupById } from "@/lib/db";

export type RegisterFormState = {
  error?: string;
};

export async function submitRegistration(
  eventId: string,
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const groupId = String(formData.get("groupId") || "");
  const name = String(formData.get("name") || "").trim();
  const gender = String(formData.get("gender") || "");
  const idCard = String(formData.get("idCard") || "").trim();
  const phone = String(formData.get("phone") || "").trim();
  const email = String(formData.get("email") || "").trim();
  const school = String(formData.get("school") || "").trim();
  const major = String(formData.get("major") || "").trim();
  const studentId = String(formData.get("studentId") || "").trim();
  const emergencyContact = String(formData.get("emergencyContact") || "").trim();
  const emergencyPhone = String(formData.get("emergencyPhone") || "").trim();

  if (!groupId || !name || !gender || !idCard || !phone || !school || !emergencyContact || !emergencyPhone) {
    return { error: "请完整填写所有必填项" };
  }

  if (!/^\d{15}(\d{2}[0-9Xx])?$/.test(idCard)) {
    return { error: "身份证号格式不正确" };
  }

  if (!/^1\d{10}$/.test(phone)) {
    return { error: "手机号格式不正确" };
  }

  const group = await getGroupById(groupId);
  if (!group || group.schedule.event.id !== eventId) {
    return { error: "报名组别不存在" };
  }

  if (!group.isOpen) {
    return { error: "该组别名额暂未开放" };
  }

  const remaining = group.capacity - group._count.registrations;
  if (remaining <= 0) {
    return { error: "该组别名额已满，请选择其他组别" };
  }

  const existing = await findExistingRegistration(eventId, groupId, idCard);
  if (existing) {
    return { error: "该身份证号已报名此组别，请勿重复提交" };
  }

  const registration = await prisma.registration.create({
    data: {
      eventId,
      groupId,
      name,
      gender,
      idCard,
      phone,
      email: email || null,
      school,
      major: major || null,
      studentId: studentId || null,
      emergencyContact,
      emergencyPhone,
      status: "pending_payment",
    },
  });

  redirect(`/registration/${registration.id}`);
}

export async function markAsPaid(registrationId: string) {
  "use server";
  await prisma.registration.update({
    where: { id: registrationId },
    data: { status: "paid" },
  });
  redirect(`/registration/${registrationId}`);
}
