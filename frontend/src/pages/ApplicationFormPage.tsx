import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createApplication,
  fetchApplication,
  updateApplication,
} from "../api/applications.ts";
import { ApplicationForm } from "../components/ApplicationForm.tsx";
import type { Application, ApplicationInput } from "../types/application.ts";

export function ApplicationFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [initial, setInitial] = useState<Application | undefined>();
  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchApplication(id)
      .then(setInitial)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(input: ApplicationInput) {
    if (isEdit && id) {
      await updateApplication(id, input);
      navigate(`/applications/${id}`);
      return;
    }
    const created = await createApplication(input);
    navigate(`/applications/${created.id}`);
  }

  if (loading) return <p className="text-slate-600">Loading...</p>;
  if (error) return <p className="rounded-lg bg-rose-50 p-4 text-rose-700">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          {isEdit ? "Edit application" : "New application"}
        </h1>
        <p className="mt-1 text-slate-600">
          {isEdit ? "Update your application details." : "Add a new job application to track."}
        </p>
      </div>
      <ApplicationForm
        initial={initial}
        submitLabel={isEdit ? "Save changes" : "Create application"}
        onSubmit={handleSubmit}
        onCancel={() => navigate(isEdit && id ? `/applications/${id}` : "/applications")}
      />
    </div>
  );
}
