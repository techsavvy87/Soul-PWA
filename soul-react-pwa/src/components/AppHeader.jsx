import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import HomeImg from "../assets/imgs/home.png";
import NavigationDrawer from "./NavigationDrawer";
import InfoModal from "./InfoModal";
import { get } from "../utils/axios";
import { useDispatch, useSelector } from "react-redux";
import { setInfo } from "../redux/appsettingSlice";

const AppHeader = () => {
  const [infoData, setInfoData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const renderStatus = useRef(false);
  const dispatch = useDispatch();
  const appInfo = useSelector((state) => state.appsetting.Info.app);
  const pageList = [
    "/cards",
    "/card/detail/:id",
    "/card/fullscreen",
    "/meditation",
    "/meditation/detail/:id",
    "/meditation/audio/:id",
    "/meditation/video/:id",
    "/journal",
    "/journal/new",
    "/journal/welcome",
    "/journal/edit/:id",
    "cards-adjective",
    "/reading",
    "/reading/fullscreen",
    "/reading/detail/:id",
    "/reading/client-detail/:id",
  ];
  const isInPageList = pageList.some((path) =>
    matchPath(path, location.pathname)
  );
  const LogoTextColor = isInPageList ? "text-[#3F356E]" : "text-white";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await get("/app/info");
        dispatch(
          setInfo({
            Info: {
              app: response.data.app_info,
              meditation: response.data.meditation_info,
            },
          })
        );
        setInfoData(response.data.app_info);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (!renderStatus.current) {
      renderStatus.current = true;
      if (!appInfo) {
        fetchData();
      } else {
        setInfoData(appInfo);
      }
    }
  }, []);

  return (
    <div className="app-header flex items-center justify-between">
      <img src={HomeImg} alt="Home" onClick={() => navigate("/")} />
      <div className="flex items-center">
        <p className={`font-poppins text-[22px] ${LogoTextColor} font-bold`}>
          Blended Soul
        </p>
        <InfoModal title="About Blended Soul" description={infoData} />
      </div>
      <NavigationDrawer />
    </div>
  );
};

export default AppHeader;
