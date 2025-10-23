// hooks/useAppInfo.jsx
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get } from "../utils/axios";
import { setInfo } from "../redux/appsettingSlice";

export const useAppInfo = () => {
  const [localInfo, setLocalInfo] = useState(null);
  const renderStatus = useRef(false);
  const dispatch = useDispatch();
  const appInfo = useSelector((state) => state.appsetting.Info.app);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get("/app/info");
        const appData = response.data.app_info;

        // Update Redux store
        dispatch(
          setInfo({
            Info: {
              app: appData,
              meditation: response.data.meditation_info,
            },
          })
        );

        // Update local state
        setLocalInfo(appData);

        // Cache in localStorage for offline
        window.localStorage.setItem("appInfo", JSON.stringify(appData));
        window.localStorage.setItem(
          "meditationInfo",
          JSON.stringify(response.data.meditation_info)
        );
      } catch (error) {
        console.error("Error fetching app info:", error);

        // If offline, load cached data
        const cached = window.localStorage.getItem("appInfo");
        if (cached) {
          setLocalInfo(JSON.parse(cached));
        }
      }
    };

    if (!renderStatus.current) {
      renderStatus.current = true;

      // If Redux already has data, use it
      if (appInfo) {
        setLocalInfo(appInfo);
      } else {
        fetchData();
      }
    }
  }, [appInfo, dispatch]);

  return localInfo;
};
