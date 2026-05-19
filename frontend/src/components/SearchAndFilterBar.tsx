import { APPLICATION_STATUSES, type ApplicationStatus } from "../types/application.ts";

type SearchAndFilterBarProps = {
  search: string;
  status: ApplicationStatus | "";
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ApplicationStatus | "") => void;
};

export function SearchAndFilterBar({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: SearchAndFilterBarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
      <label className="flex-1 text-sm">
        <span className="mb-1 block font-medium text-slate-700">Search</span>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Company or job title"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-500 focus:outline-none"
        />
      </label>
      <label className="w-full text-sm sm:w-48">
        <span className="mb-1 block font-medium text-slate-700">Status</span>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ApplicationStatus | "")}
          className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:border-slate-500 focus:outline-none"
        >
          <option value="">All statuses</option>
          {APPLICATION_STATUSES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
