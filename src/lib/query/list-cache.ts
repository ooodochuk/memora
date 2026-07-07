export function upsertById<T extends { id: string }>(
  list: T[] | undefined,
  item: T,
  sort?: (a: T, b: T) => number,
): T[] {
  const base = list ?? [];
  const exists = base.some((entry) => entry.id === item.id);
  const next = exists
    ? base.map((entry) => (entry.id === item.id ? item : entry))
    : [...base, item];
  return sort ? [...next].sort(sort) : next;
}

export function removeById<T extends { id: string }>(
  list: T[] | undefined,
  id: string,
): T[] {
  return (list ?? []).filter((entry) => entry.id !== id);
}
