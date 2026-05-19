import { useState, type FormEvent } from "react";
import {
  APPLICATION_STATUSES,
  type Application,
  type ApplicationInput,
  type ApplicationStatus,
} from "../types/application.ts";
import { dateInputToIso, toDateInputValue } from "../utils/dates.ts";

type ApplicationFormProps = {
  initial?: Application;
  submitLabel: string;
  onSubmit: (input: ApplicationInput) => Promise<void>;
  onCancel: () => void;
};

export function ApplicationForm({
  initial,
  submitLabel,
  onSubmit,
  onCancel,
}: ApplicationFormProps) {
  const [companyName, setCompanyName] = useState(initial?.companyName ?? "");
  const [jobTitle, setJobTitle] = useState(initial?.jobTitle ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [jobUrl, setJobUrl] = useState(initial?.jobUrl ?? "");
  const [status, setStatus] = useState<ApplicationStatus>(initial?.status ?? "Interested");
  const [appliedDate, setAppliedDate] = useState(toDateInputValue(initial?.appliedDate));
  const [deadline, setDeadline] = useState(toDateInputValue(initial?.deadline));
  const [interviewDate, setInterviewDate] = useState(
    toDateInputValue(initial?.interviewDate),
  );
  const [salaryRange, setSalaryRange] = useState(initial?.salaryRange ?? "");
  const [contactPerson, setContactPerson] = useState(initial?.contactPerson ?? "");
  const [contactEmail, setContactEmail] = useState(initial?.contactEmail ?? "");
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit({
        companyName: companyName.trim(),
        jobTitle: jobTitle.trim(),
        location: location.trim() || null,
        jobUrl: jobUrl.trim() || null,
        status,
        appliedDate: dateInputToIso(appliedDate),
        deadline: dateInputToIso(deadline),
        interviewDate: dateInputToIso(interviewDate),
        salaryRange: salaryRange.trim() || null,
        contactPerson: contactPerson.trim() || null,
        contactEmail: contactEmail.trim() || null,
        notes: notes.trim() || null,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save application");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-500 focus:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Company *</span>
          <input
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Job title *</span>
          <input
            required
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Location</span>
          <input value={location} onChange={(e) => setLocation(e.target.value)} className={inputClass} />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Job URL</span>
          <input
            type="url"
            value={jobUrl}
            onChange={(e) => setJobUrl(e.target.value)}
            className={inputClass}
            placeholder="https://"
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Status</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ApplicationStatus)}
            className={inputClass}
          >
            {APPLICATION_STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Salary range</span>
          <input
            value={salaryRange}
            onChange={(e) => setSalaryRange(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Applied date</span>
          <input
            type="date"
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Deadline</span>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Interview date</span>
          <input
            type="date"
            value={interviewDate}
            onChange={(e) => setInterviewDate(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Contact person</span>
          <input
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Contact email</span>
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            className={inputClass}
          />
        </label>
        <label className="text-sm sm:col-span-2">
          <span className="mb-1 block font-medium">Notes</span>
          <textarea
            rows={4}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={inputClass}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
