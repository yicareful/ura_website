"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export type EventFormState = {
  error?: string;
};

type GroupInput = {
  name: string;
  distance: number;
  startTime: string;
  cutoffTime: string;
  gender: string;
  minAge?: number | null;
  maxAge?: number | null;
  capacity: number;
  fee: number;
};

function parseGroups(raw: string): GroupInput[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;

    for (const group of parsed) {
      if (
        !group.name ||
        !group.distance ||
        !group.startTime ||
        !group.cutoffTime ||
        !group.gender ||
        !group.capacity ||
        group.fee === undefined
      ) {
        return null;
      }
    }

    return parsed;
  } catch {
    return null;
  }
}

function parseClockTime(value: string): number | null {
  const match = value.match(/^([01]?\d|2[0-3]):([0-5]\d)$/);
  if (!match) return null;

  const [, hours, minutes] = match;
  return Number(hours) * 60 + Number(minutes);
}

function validateGroupTimes(groups: GroupInput[]): string | null {
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    const startMinutes = parseClockTime(group.startTime);
    const cutoffMinutes = parseClockTime(group.cutoffTime);

    if (startMinutes === null || cutoffMinutes === null) {
      return `组别 ${i + 1} 的起跑时间和关门时间格式必须为 HH:mm`;
    }

    if (startMinutes >= cutoffMinutes) {
      return `组别 ${i + 1} 的起跑时间必须早于关门时间`;
    }
  }

  return null;
}

function validateGroupAges(groups: GroupInput[]): string | null {
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];

    if (group.minAge == null || group.maxAge == null) {
      continue;
    }

    if (Number(group.minAge) >= Number(group.maxAge)) {
      return `组别 ${i + 1} 的最小年龄必须小于最大年龄`;
    }
  }

  return null;
}

function slugify(title: string) {
  return (
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, "-")
      .replace(/^-+|-+$/g, "") || `event-${Math.floor(Math.random() * 1e6)}`
  );
}

export async function createEvent(
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const registrationStart = String(formData.get("registrationStart") || "");
  const registrationEnd = String(formData.get("registrationEnd") || "");
  const eventDate = String(formData.get("eventDate") || "");
  const status = String(formData.get("status") || "draft");
  const groupsRaw = String(formData.get("groupsJson") || "");

  if (!title || !description || !city || !location || !registrationStart || !registrationEnd || !eventDate) {
    return { error: "请完整填写所有必填项" };
  }

  const regStart = new Date(registrationStart);
  const regEnd = new Date(registrationEnd);
  const eventDt = new Date(eventDate);

  if (isNaN(regStart.getTime()) || isNaN(regEnd.getTime()) || isNaN(eventDt.getTime())) {
    return { error: "日期格式不正确" };
  }

  if (regEnd <= regStart) {
    return { error: "报名截止时间必须晚于报名开始时间" };
  }

  if (eventDt < regEnd) {
    return { error: "赛事日期不能早于报名截止时间" };
  }

  const groups = parseGroups(groupsRaw);
  if (!groups) {
    return { error: "请至少添加一个组别，并完整填写组别信息" };
  }

  const groupTimeError = validateGroupTimes(groups);
  if (groupTimeError) {
    return { error: groupTimeError };
  }

  const groupAgeError = validateGroupAges(groups);
  if (groupAgeError) {
    return { error: groupAgeError };
  }

  const slug = slugify(title);

  await prisma.event.create({
    data: {
      title,
      slug,
      description,
      city,
      location,
      registrationStart: regStart,
      registrationEnd: regEnd,
      eventDate: eventDt,
      status,
      groups: {
        create: groups.map((group) => ({
          name: group.name,
          distance: Number(group.distance),
          startTime: group.startTime,
          cutoffTime: group.cutoffTime,
          gender: group.gender,
          minAge: group.minAge ?? null,
          maxAge: group.maxAge ?? null,
          capacity: Number(group.capacity),
          fee: Number(group.fee),
        })),
      },
    },
  });

  redirect("/admin/events");
}

export async function updateEvent(
  eventId: string,
  _prevState: EventFormState,
  formData: FormData
): Promise<EventFormState> {
  const title = String(formData.get("title") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const city = String(formData.get("city") || "").trim();
  const location = String(formData.get("location") || "").trim();
  const registrationStart = String(formData.get("registrationStart") || "");
  const registrationEnd = String(formData.get("registrationEnd") || "");
  const eventDate = String(formData.get("eventDate") || "");
  const status = String(formData.get("status") || "draft");

  if (!title || !description || !city || !location || !registrationStart || !registrationEnd || !eventDate) {
    return { error: "请完整填写所有必填项" };
  }

  const regStart = new Date(registrationStart);
  const regEnd = new Date(registrationEnd);
  const eventDt = new Date(eventDate);

  if (isNaN(regStart.getTime()) || isNaN(regEnd.getTime()) || isNaN(eventDt.getTime())) {
    return { error: "日期格式不正确" };
  }

  if (regEnd <= regStart) {
    return { error: "报名截止时间必须晚于报名开始时间" };
  }

  if (eventDt < regEnd) {
    return { error: "赛事日期不能早于报名截止时间" };
  }

  await prisma.event.update({
    where: { id: eventId },
    data: {
      title,
      description,
      city,
      location,
      registrationStart: regStart,
      registrationEnd: regEnd,
      eventDate: eventDt,
      status,
    },
  });

  redirect(`/admin/events/${eventId}`);
}