import { useState } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import cancelImg from "../assets/imgs/cancel.png";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { resetAppSetting } from "../redux/appsettingSlice";
import { get } from "../utils/axios";
import LoadingModal from "./LoadingModal";
import { setIsLoading, setPrevPageName } from "../redux/appsettingSlice";
import DeckIcon from "@mui/icons-material/Deck";
import ScheduleIcon from "@mui/icons-material/Schedule";
import StoreIcon from "@mui/icons-material/Store";
import EditIcon from "@mui/icons-material/Edit";
import HomeImg from "../assets/imgs/home.png";
import PsychologyIcon from "@mui/icons-material/Psychology";
import InfoModal from "./InfoModal";
import Popup from "./Popup";
import lockImg from "../assets/imgs/lock.png";

const NavigationDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { isLoading } = useSelector((state) => state.appsetting);
  let mediInfo = useSelector((state) => state.appsetting.Info.meditation);
  const userTier = useSelector((state) => state.auth.tier);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  if (!navigator.onLine) {
    mediInfo = JSON.parse(window.localStorage.getItem("meditationInfo"));
  }
  // Handle user logout
  const onClickLogout = async () => {
    try {
      dispatch(setIsLoading({ isLoading: true }));

      // Check if offline
      if (!navigator.onLine) {
        console.warn("Offline: Logging out locally.");

        // Local-only logout
        dispatch(logout());
        dispatch(resetAppSetting());
        localStorage.clear();
        dispatch(setIsLoading({ isLoading: false }));
        navigate("/login");
        return; // stop further execution
      }

      // Online logout
      const result = await get("/logout");
      const resResult = result.data;

      if (resResult.status) {
        dispatch(logout());
        dispatch(resetAppSetting());
        localStorage.clear();
        dispatch(setIsLoading({ isLoading: false }));
        navigate("/login");
      } else {
        console.error("Logout failed:", resResult);
        dispatch(setIsLoading({ isLoading: false }));
      }
    } catch (error) {
      console.error("Logout error:", error);

      // Optional: fallback to local logout even if API fails
      dispatch(logout());
      dispatch(resetAppSetting());
      localStorage.clear();
      dispatch(setIsLoading({ isLoading: false }));
      navigate("/login");
    }
  };

  const handleClosePopup = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <button
        onClick={toggleDrawer(true)}
        className="w-12.5 h-12.5 rounded-full bg-[#8690FD] flex items-center justify-center text-white hover:bg-gray-700 transition"
      >
        <MenuIcon size={24} />
      </button>

      {/* Drawer */}
      <Drawer
        open={open}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: { width: "70%" },
        }}
        anchor="right"
      >
        <Box
          sx={{ width: "100%" }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <div className="p-4 flex justify-between items-center border-b-[0.5px] border-[#8690FD4D]">
            <Link to="/" className="text-gray-600">
              <img className="w-11" src={HomeImg} alt="Logo" />
            </Link>
            <button onClick={toggleDrawer(false)} className="text-gray-600">
              <img src={cancelImg} alt="cancel" />
            </button>
          </div>
          <div className="py-2.5 px-5">
            <p className="uppercase font-poppins font-semibold text-[14px] bg-gradient-to-r from-[#574A98] to-[#C12888] bg-clip-text text-transparent">
              Explore the app
            </p>
            <ul className="py-4">
              <Link
                to="/subscription"
                className="cursor-pointer flex items-center font-poppins text-[16px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                <SubscriptionsIcon className="w-[15px] mr-3" />
                Subscription
              </Link>
              <Link
                to="/deck-list"
                className="cursor-pointer flex items-center font-poppins text-[16px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                <DeckIcon className="w-[15px] mr-3" />
                Browse Decks
              </Link>
              <Link
                to="/favorites"
                className="cursor-pointer flex items-center font-poppins text-[16px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                <FavoriteIcon className="w-[15px] mr-3" />
                Favorites
              </Link>
              <Link
                to="/meditation"
                className="cursor-pointer flex items-center font-poppins text-[16px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                <PsychologyIcon className="w-[15px] mr-3" />
                Guided Meditations
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <InfoModal
                    title={mediInfo.title}
                    description={mediInfo.description}
                  />
                </div>
              </Link>
              <Link
                to="/journal"
                onClick={(e) => {
                  if (userTier === "free") {
                    e.preventDefault();
                    e.stopPropagation();
                    setAnchorEl(e.currentTarget);
                  }
                }}
                className="cursor-pointer flex items-center justify-between font-poppins text-[16px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                <div>
                  <EditIcon
                    className="w-[15px] mr-3"
                    sx={{ transform: "rotate(-45deg)" }}
                  />
                  Journal
                </div>
                {userTier === "free" && (
                  <img className="w-[21px] h-[26px]" src={lockImg} alt="lock" />
                )}
              </Link>

              <li className="cursor-pointer flex items-center font-poppins text-[16px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3">
                <ScheduleIcon className="w-[15px] mr-3" />
                <a
                  href="https://www.paulwagner.com/intuitive-psychic-readings/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Schedule A Session
                </a>
              </li>
              <Link
                to="/store"
                className="cursor-pointer flex items-center font-poppins text-[16px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                <StoreIcon className="w-[15px] mr-3" />
                Store
              </Link>
              <li
                onClick={() => onClickLogout()}
                className="cursor-pointer flex items-center font-poppins text-[16px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                <LogoutIcon className="w-[15px] mr-3" />
                Log Out
              </li>
            </ul>
            <p className="py-2.5 uppercase font-poppins font-semibold text-[14px] bg-gradient-to-r from-[#574A98] to-[#C12888] bg-clip-text text-transparent">
              discover more
            </p>
            <ul className="py-4">
              <Link
                to="/concept"
                className="cursor-pointer flex items-center font-poppins text-[16px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                What is Blended Soul?
              </Link>
              <Link
                to="/faq"
                className="cursor-pointer flex items-center font-poppins text-[16px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                FAQ
              </Link>
              <Link
                to="/about"
                className="cursor-pointer flex items-center font-poppins text-[16px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                About Paul
              </Link>
              <li className="cursor-pointer flex items-center font-poppins text-[16px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3">
                <a
                  href="https://paulwagner.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Paul's Website
                </a>
              </li>
              <Link
                to="/creative-lab"
                className="cursor-pointer flex items-center font-poppins text-[16px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                About Creative Lab
              </Link>

              {/* <Link
                to="/reading"
                onClick={() =>
                  dispatch(setPrevPageName({ pageName: "burger" }))
                }
                className="cursor-pointer flex items-center font-poppins text-[16px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                Reading
              </Link> */}
            </ul>
          </div>
        </Box>
      </Drawer>
      <Popup anchorEl={anchorEl} onClose={handleClosePopup} />
      <LoadingModal open={isLoading} />
    </div>
  );
};

export default NavigationDrawer;
