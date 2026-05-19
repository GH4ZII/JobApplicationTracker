export function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function toDateInputValue(value: string | null | undefined): string {
  if (!value) return "";
  return value.slice(0, 10);
}

export function dateInputToIso(value: string): string | null {
  if (!value) return null;
  return new Date(`${value}T12:00:00.000Z`).toISOString();
}

export function isUpcoming(value: string | null | undefined): boolean {
  if (!value) return false;
  return new Date(value).getTime() >= Date.now();
}
