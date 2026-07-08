import { DefaultCertificate } from "./DefaultCertificate";
import { JinanHalfCertificate } from "./JinanHalfCertificate";
import type { CertificateTemplate } from "./types";

/**
 * Per-event certificate registry, keyed by Event.slug.
 *
 * The system stays decoupled: each event owns a dedicated template that defines
 * its own background and what data it surfaces. Adding an event = add a template
 * file + one line here. Any slug without an entry falls back to the generic
 * `DefaultCertificate`.
 */
const CERTIFICATE_TEMPLATES: Record<string, CertificateTemplate> = {
  "jinan-half-marathon-2026": JinanHalfCertificate,
};

export function getCertificateTemplate(slug: string): CertificateTemplate {
  return CERTIFICATE_TEMPLATES[slug] ?? DefaultCertificate;
}

export type { CertificateData, CertificateTemplate } from "./types";