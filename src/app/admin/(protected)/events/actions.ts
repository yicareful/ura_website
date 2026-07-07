"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export type EventFormState = {
  error?: string;
};

type ScheduleInput = {
  name: string;
  distance: number;
  startTime: string;
  cutoffTime: string;
  capacity: number;
  groups: {
    name: string;
    gender: string;
    minAge?: number | null;
    maxAge?: number | null;
    capacity: number;
    fee: number;
  }[];
};

function parseSchedules(raw: string): ScheduleInput[] | null {
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    for (const s of parsed) {
      if (!s.name || !s.distance || !s.startTime || !s.cutoffTime || !s.capacity) return null;
      if (!Array.isArray(s.groups) || s.groups.length === 0) return null;
      for (const g of s.groups) {
        if (!g.name || !g.gender || !g.capacity || g.fee === undefined) return null;
      }
    }
    return parsed;
  } catch {
    return null;
  }
}

function slugify(title: string) {
  return (
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9一-龥]+/g, "-")
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
  const schedulesRaw = String(formData.get("schedulesJson") || "");

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

  const schedules = parseSchedules(schedulesRaw);
  if (!schedules) {
    return { error: "请至少添加一个赛程，且每个赛程至少包含一个组别" };
  }

  const slug = slugify(title);

  await prisma.$transaction(async (tx) => {
    const event = await tx.event.create({
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
      },
    });

    for (const schedule of schedules) {
      const createdSchedule = await tx.schedule.create({
        data: {
          eventId: event.id,
          name: schedule.name,
          distance: Number(schedule.distance),
          startTime: schedule.startTime,
          cutoffTime: schedule.cutoffTime,
          capacity: Number(schedule.capacity),
        },
      });

      await tx.group.createMany({
        data: schedule.groups.map((g) => ({
          scheduleId: createdSchedule.id,
          name: g.name,
          gender: g.gender,
          minAge: g.minAge ?? null,
          maxAge: g.maxAge ?? null,
          capacity: Number(g.capacity),
          fee: Number(g.fee),
        })),
      });
    }
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
