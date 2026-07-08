import type { FinishData } from "@/lib/certificate";

/**
 * Decoupled certificate data: the page assembles everything a template could
 * need (registration + event + group + simulated finish), so each per-event
 * certificate template only depends on this shape — not on the system's query
 * layer or auth. Templates decide how much (or how little) to show.
 */
export type CertificateData = {
  registrationId: string;
  bib: string;
  name: string;
  genderLabel: string;
  school: string;

  eventTitle: string;
  eventSlug: string;
  eventCity: string;
  eventLocation: string;
  eventDateLabel: string;

  groupName: string;
  distance: number;
  startTime: string;

  finish: FinishData;
  issued: string;
};

export type CertificateTemplate = React.ComponentType<{ data: CertificateData }>;