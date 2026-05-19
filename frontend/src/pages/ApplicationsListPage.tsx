import { useEffect, useMemo, useState } from "react";
import { fetchApplications } from "../api/applications.ts";
import { ApplicationTable } from "../components/ApplicationTable.tsx";
import { SearchAndFilterBar } from "../components/SearchAndFilterBar.tsx";
import type { Application, ApplicationStatus } from "../types/application.ts";

export function ApplicationsListPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ApplicationStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchApplications({
      status: status || undefined,
      search: search.trim() || undefined,
    })
      .then(setApplications)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [search, status]);

  const title = useMemo(() => {
    if (status) return `${status} applications`;
    return "All applications";
  }, [status]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Applications</h1>
        <p className="mt-1 text-slate-600">{title}</p>
      </div>

      <SearchAndFilterBar
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
      />

      {loading && <p className="text-slate-600">Loading applications...</p>}
      {error && <p className="rounded-lg bg-rose-50 p-4 text-rose-700">{error}</p>}
      {!loading && !error && <ApplicationTable applications={applications} />}
    </div>
  );
}
