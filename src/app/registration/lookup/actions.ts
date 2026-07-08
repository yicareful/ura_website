"use server";

import { findRegistrationsByIdCardAndPhone } from "@/lib/db";

export async function lookupRegistrations(idCard: string, phone: string) {
  if (!idCard || !phone) return [];
  const results = await findRegistrationsByIdCardAndPhone(idCard, phone);
  return results.map((r) => ({
    id: r.id,
    status: r.status,
    eventTitle: r.event.title,
    groupName: r.group.name,
  }));
}