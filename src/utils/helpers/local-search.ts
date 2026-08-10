/**
 * Generic client-side text search used by report pages to filter an already-fetched dataset
 * entirely in the browser - no extra API requests when the user types. `values` should include
 * every field (including nested arrays flattened by the caller, e.g. every item.product.title in
 * an order) that a match on this row should be considered a hit for.
 */
export function matchesSearchTerm(term: string, values: Array<string | number | null | undefined>): boolean {
  const needle = term.trim().toLowerCase();
  if (!needle) return true;
  return values.some((value) => value !== null && value !== undefined && String(value).toLowerCase().includes(needle));
}
