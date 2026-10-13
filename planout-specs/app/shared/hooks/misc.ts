import { useEffect, useMemo, useRef, useState } from "react";

export function useDebounce<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/** Client-side pagination over an in-memory list. Resets to page 1 when the list identity changes length. */
export function usePagination<T>(items: T[], pageSize = 10) {
  const [page, setPage] = useState(1);
  const total = items.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => {
    if (page > pageCount) setPage(1);
  }, [page, pageCount]);
  const pageItems = useMemo(() => items.slice((page - 1) * pageSize, page * pageSize), [items, page, pageSize]);
  return {
    page,
    pageCount,
    total,
    pageItems,
    from: total ? (page - 1) * pageSize + 1 : 0,
    to: Math.min(page * pageSize, total),
    next: () => setPage((p) => Math.min(pageCount, p + 1)),
    prev: () => setPage((p) => Math.max(1, p - 1)),
    setPage,
  };
}

/**
 * Track which element (by id) is currently at the top of a scroll container.
 * Used by document views to keep the TOC's active item in sync.
 */
export function useActiveSection(ids: string[], onActive: (id: string) => void, rootRef: React.RefObject<HTMLElement | null>) {
  const cb = useRef(onActive);
  cb.current = onActive;
  const key = ids.join("|");
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !ids.length) return;
    const visible = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? visible.set(e.target.id, e.boundingClientRect.top) : visible.delete(e.target.id)));
        const first = [...visible.entries()].sort((a, b) => a[1] - b[1])[0];
        if (first) cb.current(first[0]);
      },
      { root, rootMargin: "0px 0px -65% 0px", threshold: 0 },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, rootRef]);
}
