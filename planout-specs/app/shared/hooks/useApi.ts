import { useCallback, useEffect, useRef, useState, type DependencyList } from "react";

/** Generic async loader: { data, loading, error, reload, setData }. Ignores stale responses. */
export function useApi<T>(fetcher: () => Promise<T>, deps: DependencyList, opts: { enabled?: boolean } = {}) {
  const enabled = opts.enabled ?? true;
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const seq = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fetcher, deps);

  const load = useCallback(
    async (silent = false) => {
      const id = ++seq.current;
      if (!silent) setLoading(true);
      try {
        const result = await run();
        if (id === seq.current) {
          setData(result);
          setError(null);
        }
      } catch (e) {
        if (id === seq.current) setError((e as Error).message || "Request failed");
      } finally {
        if (id === seq.current) setLoading(false);
      }
    },
    [run],
  );

  useEffect(() => {
    if (enabled) load();
  }, [load, enabled]);

  return { data, loading, error, reload: (silent = true) => load(silent), setData };
}
