import { Link } from "react-router-dom";
import type { Application } from "../types/application.ts";
import { formatDate } from "../utils/dates.ts";
import { StatusBadge } from "./StatusBadge.tsx";

type ApplicationTableProps = {
  applications: Application[];
};

export function ApplicationTable({ applications }: ApplicationTableProps) {
  if (applications.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
        No applications found.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
          <tr>
            <th className="px-4 py-3 font-medium">Company</th>
            <th className="px-4 py-3 font-medium">Role</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Applied</th>
            <th className="px-4 py-3 font-medium">Deadline</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => (
            <tr key={application.id} className="border-b border-slate-100 last:border-0">
              <td className="px-4 py-3">
                <Link
                  to={`/applications/${application.id}`}
                  className="font-medium text-slate-900 hover:underline"
                >
                  {application.companyName}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-600">{application.jobTitle}</td>
              <td className="px-4 py-3">
                <StatusBadge status={application.status} />
              </td>
              <td className="px-4 py-3 text-slate-600">
                {formatDate(application.appliedDate)}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {formatDate(application.deadline)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
