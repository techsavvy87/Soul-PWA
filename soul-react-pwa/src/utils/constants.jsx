// export const baseURL = "http://127.0.0.1:8000/api/v1";
// export const siteBaseUrl = "http://127.0.0.1:8000/storage/";

// export const baseURL = "http://192.168.13.116:8000/api/v1";
// export const siteBaseUrl = "http://192.168.13.116:8000/storage/";
// export const hostingDomain = "http://localhost:5173/";

export const baseURL = "https://bsadmin.paulwagner.com/api/v1";
export const siteBaseUrl = "https://bsadmin.paulwagner.com/storage/";
export const hostingDomain = "https://bsapp.paulwagner.com/";

export const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const result =
    hours < 1
      ? `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      : `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
          2,
          "0"
        )}:${String(secs).padStart(2, "0")}`;

  return result;
};

export const NEW_PUSH_NOTI_PUBLIC_KEY =
  "BLfb7k6QZVtnNxd5xP7gIXoj8PPoCt9viAZ4Z7J65RCA8x30kAweUBceiiiL6xxRlzaqQt5FDHnr3F-1AC0b4-U";

export const PAYPAL_CLIENT_ID =
  "AQ4J5RBmpGO94oUylFDdC_v9OLgSW1mo71RaHNQoE6yI_JjLAhxN582tgC3szVgmHLWAw3QMXM_DNf1l";
