import { useEffect, useState } from "react";
import { useNavigate, useLocation, matchPath } from "react-router-dom";
import HomeImg from "../assets/imgs/home.png";
import NavigationDrawer from "./NavigationDrawer";
import { FaInfo } from "react-icons/fa6";
import InfoModal from "./InfoModal";
import { get } from "../utils/axios";

const AppHeader = () => {
  const [infoData, setInfoData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
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
        setInfoData(response.data.info);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
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
