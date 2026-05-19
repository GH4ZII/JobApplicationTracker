import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchApplications } from "../api/applications.ts";
import { DashboardStats } from "../components/DashboardStats.tsx";
import type { Application } from "../types/application.ts";
import { formatDate, isUpcoming } from "../utils/dates.ts";

export function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications()
      .then(setApplications)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const upcomingDeadlines = applications
    .filter((a) => isUpcoming(a.deadline))
    .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
    .slice(0, 5);

  const upcomingInterviews = applications
    .filter((a) => isUpcoming(a.interviewDate))
    .sort(
      (a, b) => new Date(a.interviewDate!).getTime() - new Date(b.interviewDate!).getTime(),
    )
    .slice(0, 5);

  if (loading) {
    return <p className="text-slate-600">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="rounded-lg bg-rose-50 p-4 text-rose-700">{error}</p>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-600">Overview of your job search progress.</p>
      </div>

      <DashboardStats applications={applications} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">Upcoming deadlines</h2>
          {upcomingDeadlines.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No upcoming deadlines.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {upcomingDeadlines.map((app) => (
                <li key={app.id} className="flex justify-between text-sm">
                  <Link to={`/applications/${app.id}`} className="font-medium hover:underline">
                    {app.companyName} — {app.jobTitle}
                  </Link>
                  <span className="text-slate-500">{formatDate(app.deadline)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-slate-900">Upcoming interviews</h2>
          {upcomingInterviews.length === 0 ? (
            <p className="mt-3 text-sm text-slate-500">No upcoming interviews.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {upcomingInterviews.map((app) => (
                <li key={app.id} className="flex justify-between text-sm">
                  <Link to={`/applications/${app.id}`} className="font-medium hover:underline">
                    {app.companyName} — {app.jobTitle}
                  </Link>
                  <span className="text-slate-500">{formatDate(app.interviewDate)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
