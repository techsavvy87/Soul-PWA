import { useState, useEffect } from "react";
import { post } from "../utils/axios";

export default function useSmartPost(uri, options = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [queue, setQueue] = useState([]);

  const sendPost = async (data) => {
    setLoading(true);
    setError(null);

    // If offline, queue the request
    if (!navigator.onLine) {
      const pending = [...queue, { uri, data }];
      setQueue(pending);
      localStorage.setItem("offlinePostQueue", JSON.stringify(pending));
      setLoading(false);
      return { queued: true };
    }

    try {
      const res = await post(uri, data, options.isFormData);
      setResponse(res.data);
      return res.data;
    } catch (err) {
      setError(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Retry queued requests when back online
  useEffect(() => {
    const handleOnline = async () => {
      const savedQueue = JSON.parse(
        localStorage.getItem("offlinePostQueue") || "[]"
      );
      if (savedQueue.length) {
        for (const item of savedQueue) {
          try {
            await post(item.uri, item.data);
          } catch (err) {
            console.error("Failed to send queued request:", err);
          }
        }
        localStorage.removeItem("offlinePostQueue");
        setQueue([]);
      }
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [queue]);

  return { sendPost, loading, error, response };
}
