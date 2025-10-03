import { useNavigate, useLocation, matchPath } from "react-router-dom";
import HomeImg from "../assets/imgs/home.png";
import LogoWhiteText from "../assets/imgs/logo-white-text.png";
import LogoPurpleText from "../assets/imgs/logo-purple-text.png";
import NavigationDrawer from "./NavigationDrawer";

const AppHeader = () => {
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
  const LogoText = isInPageList ? LogoPurpleText : LogoWhiteText;
  return (
    <div className="app-header flex items-center justify-between">
      <img src={HomeImg} alt="Home" onClick={() => navigate("/")} />
      <img src={LogoText} alt="Soul" />
      <NavigationDrawer />
    </div>
  );
};

export default AppHeader;
