import { EVENT_STATUS_LABEL, REGISTRATION_STATUS_LABEL } from "@/lib/constants";

const EVENT_STATUS_CLASS: Record<string, string> = {
  draft: "badge-muted",
  open: "badge-success",
  closed: "badge-warning",
  finished: "badge-muted",
};

const REGISTRATION_STATUS_CLASS: Record<string, string> = {
  pending_payment: "badge-warning",
  paid: "badge-success",
  cancelled: "badge-error",
};

export function EventStatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge ${EVENT_STATUS_CLASS[status] ?? "badge-muted"}`}>
      {EVENT_STATUS_LABEL[status] ?? status}
    </span>
  );
}

export function RegistrationStatusBadge({ status }: { status: string }) {
  return (
    <span className={`badge ${REGISTRATION_STATUS_CLASS[status] ?? "badge-muted"}`}>
      {REGISTRATION_STATUS_LABEL[status] ?? status}
    </span>
  );
}
