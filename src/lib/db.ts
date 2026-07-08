import { prisma } from "./prisma";

export function getEvents() {
  return prisma.event.findMany({
    orderBy: { eventDate: "asc" },
    include: {
      groups: true,
      _count: { select: { registrations: true, groups: true } },
    },
  });
}

export function getEventById(id: string) {
  return prisma.event.findUnique({
    where: { id },
    include: {
      groups: {
        orderBy: [{ distance: "desc" }, { name: "asc" }],
        include: { _count: { select: { registrations: true } } },
      },
    },
  });
}

export function getGroupById(id: string) {
  return prisma.group.findUnique({
    where: { id },
    include: {
      event: true,
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
      group: true,
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
      group: true,
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
      _count: { select: { registrations: true, groups: true } },
    },
  });
}

export function getEventRegistrations(eventId: string) {
  return prisma.registration.findMany({
    where: { eventId },
    include: { group: true },
    orderBy: { createdAt: "desc" },
  });
}