import { useEffect, useState } from "react";
import { get } from "../utils/axios";

export default function useSmartFetch(cacheKey, uri, options = {}) {
  const [data, setData] = useState(() => {
    const cached = localStorage.getItem(cacheKey);
    return cached ? JSON.parse(cached) : null;
  });

  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // ✅ use your custom get helper
        const response = await get(uri, options);
        setData(response.data);
        localStorage.setItem(cacheKey, JSON.stringify(response.data));
        setError(null);
      } catch (err) {
        console.warn(`Fetch failed for ${uri}, falling back to cache`, err);
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          setData(JSON.parse(cached));
        } else {
          setError("No cached data available");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [uri]);

  return { data, loading, error, isOffline };
}
