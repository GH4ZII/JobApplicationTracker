import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  deleteApplication,
  fetchApplication,
  updateApplicationStatus,
} from "../api/applications.ts";
import { StatusBadge } from "../components/StatusBadge.tsx";
import { APPLICATION_STATUSES, type ApplicationStatus } from "../types/application.ts";
import { formatDate } from "../utils/dates.ts";

export function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [application, setApplication] = useState<Awaited<
    ReturnType<typeof fetchApplication>
  > | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchApplication(id)
      .then(setApplication)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleStatusChange(status: ApplicationStatus) {
    if (!id) return;
    const updated = await updateApplicationStatus(id, status);
    setApplication(updated);
  }

  async function handleDelete() {
    if (!id || !confirm("Delete this application?")) return;
    await deleteApplication(id);
    navigate("/applications");
  }

  if (loading) return <p className="text-slate-600">Loading...</p>;
  if (error || !application) {
    return <p className="rounded-lg bg-rose-50 p-4 text-rose-700">{error ?? "Not found"}</p>;
  }

  const fields = [
    ["Location", application.location],
    ["Job URL", application.jobUrl],
    ["Applied", formatDate(application.appliedDate)],
    ["Deadline", formatDate(application.deadline)],
    ["Interview", formatDate(application.interviewDate)],
    ["Salary", application.salaryRange],
    ["Contact", application.contactPerson],
    ["Email", application.contactEmail],
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">{application.companyName}</h1>
          <p className="mt-1 text-lg text-slate-600">{application.jobTitle}</p>
          <div className="mt-3">
            <StatusBadge status={application.status} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`/applications/${application.id}/edit`}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-lg border border-rose-300 px-4 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
          >
            Delete
          </button>
        </div>
      </div>

      <label className="block text-sm">
        <span className="mb-1 block font-medium text-slate-700">Change status</span>
        <select
          value={application.status}
          onChange={(e) => handleStatusChange(e.target.value as ApplicationStatus)}
          className="rounded-lg border border-slate-300 px-3 py-2"
        >
          {APPLICATION_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="grid gap-4 sm:grid-cols-2">
          {fields.map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm text-slate-500">{label}</dt>
              <dd className="mt-1 text-slate-900">
                {label === "Job URL" && value ? (
                  <a href={value} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                    {value}
                  </a>
                ) : (
                  value || "—"
                )}
              </dd>
            </div>
          ))}
        </dl>
        {application.notes && (
          <div className="mt-6 border-t border-slate-100 pt-4">
            <h2 className="text-sm font-medium text-slate-500">Notes</h2>
            <p className="mt-2 whitespace-pre-wrap text-slate-800">{application.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
