import type { ApplicationStatus } from "../types/application.ts";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  Interested: "bg-slate-100 text-slate-700",
  Applied: "bg-blue-100 text-blue-700",
  Interview: "bg-amber-100 text-amber-800",
  Offer: "bg-emerald-100 text-emerald-800",
  Rejected: "bg-rose-100 text-rose-700",
};

type StatusBadgeProps = {
  status: ApplicationStatus;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      {status}
    </span>
  );
}
