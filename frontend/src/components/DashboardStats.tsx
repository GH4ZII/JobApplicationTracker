import { APPLICATION_STATUSES, type Application } from "../types/application.ts";

type DashboardStatsProps = {
  applications: Application[];
};

export function DashboardStats({ applications }: DashboardStatsProps) {
  const counts = APPLICATION_STATUSES.reduce(
    (acc, status) => {
      acc[status] = applications.filter((a) => a.status === status).length;
      return acc;
    },
    {} as Record<(typeof APPLICATION_STATUSES)[number], number>,
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Total applications</p>
        <p className="mt-1 text-3xl font-semibold text-slate-900">{applications.length}</p>
      </div>
      {APPLICATION_STATUSES.map((status) => (
        <div
          key={status}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm text-slate-500">{status}</p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{counts[status]}</p>
        </div>
      ))}
    </div>
  );
}
