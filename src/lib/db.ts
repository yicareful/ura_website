import { prisma } from "./prisma";

export function getEvents() {
  return prisma.event.findMany({
    orderBy: { eventDate: "asc" },
    include: {
      schedules: true,
      _count: { select: { registrations: true } },
    },
  });
}

export function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      schedules: {
        orderBy: { distance: "desc" },
        include: {
          groups: {
            include: { _count: { select: { registrations: true } } },
          },
        },
      },
    },
  });
}

export function getGroupById(id: string) {
  return prisma.group.findUnique({
    where: { id },
    include: {
      schedule: { include: { event: true } },
      _count: { select: { registrations: true } },
    },
  });
}

export function findExistingRegistration(
  eventId: string,
  groupId: string,
  idCard: string
) {
  return prisma.registration.findUnique({
    where: {
      eventId_groupId_idCard: { eventId, groupId, idCard },
    },
  });
}

export function getRegistrationById(id: string) {
  return prisma.registration.findUnique({
    where: { id },
    include: {
      event: true,
      group: { include: { schedule: true } },
    },
  });
}

export function findRegistrationsByIdCardAndPhone(
  idCard: string,
  phone: string
) {
  return prisma.registration.findMany({
    where: { idCard, phone },
    include: {
      event: true,
      group: { include: { schedule: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminStats() {
  const [eventCount, registrationCount, paidCount] = await Promise.all([
    prisma.event.count(),
    prisma.registration.count(),
    prisma.registration.count({ where: { status: "paid" } }),
  ]);
  return { eventCount, registrationCount, paidCount };
}

export function getEventsForAdmin() {
  return prisma.event.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { registrations: true, schedules: true } },
    },
  });
}

export function getEventRegistrations(eventId: string) {
  return prisma.registration.findMany({
    where: { eventId },
    include: { group: { include: { schedule: true } } },
    orderBy: { createdAt: "desc" },
  });
}
