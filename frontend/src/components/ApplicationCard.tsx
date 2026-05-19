import { Link } from "react-router-dom";
import type { Application } from "../types/application.ts";
import { formatDate } from "../utils/dates.ts";
import { StatusBadge } from "./StatusBadge.tsx";

type ApplicationCardProps = {
  application: Application;
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <Link
      to={`/applications/${application.id}`}
      className="block rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-900">{application.companyName}</h3>
          <p className="text-sm text-slate-600">{application.jobTitle}</p>
          {application.location && (
            <p className="mt-1 text-sm text-slate-500">{application.location}</p>
          )}
        </div>
        <StatusBadge status={application.status} />
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
        <span>Applied: {formatDate(application.appliedDate)}</span>
        <span>Deadline: {formatDate(application.deadline)}</span>
      </div>
    </Link>
  );
}
