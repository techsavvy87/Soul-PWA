import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import LogoImg from "../assets/imgs/logo.png";
import cancelImg from "../assets/imgs/cancel.png";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { get } from "../utils/axios";
import LoadingModal from "./LoadingModal";
import { setIsLoading } from "../redux/appsettingSlice";

const NavigationDrawer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const { isLoading } = useSelector((state) => state.appsetting);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // Handle user logout
  const onClickLogout = async () => {
    try {
      dispatch(setIsLoading({ isLoading: true }));
      const result = await get("/logout");
      const resResult = result.data;
      if (resResult.status) {
        dispatch(logout());
        sessionStorage.clear();
        dispatch(setIsLoading({ isLoading: false }));
        navigate("/login");
      }
    } catch (error) {
      dispatch(setIsLoading({ isLoading: false }));
    }
  };

  return (
    <div>
      <button
        onClick={toggleDrawer(true)}
        className="w-12 h-12 rounded-full bg-[#8690FD] flex items-center justify-center text-white hover:bg-gray-700 transition"
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
              <img className="w-11" src={LogoImg} alt="Logo" />
            </Link>
            <button onClick={toggleDrawer(false)} className="text-gray-600">
              <img src={cancelImg} alt="cancel" />
            </button>
          </div>
          <div className="py-7 px-9">
            <p className="uppercase font-poppins font-semibold text-[12px] bg-gradient-to-r from-[#574A98] to-[#C12888] bg-clip-text text-transparent">
              Explore the app
            </p>
            <ul className="py-4 space-y-4">
              <Link
                to="/"
                className="hover:text-blue-500 cursor-pointer flex items-center font-poppins text-[15.5px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                <SearchIcon className="w-[15px] mr-3" />
                Browse Decks
              </Link>
              <Link
                to="/subscription"
                className="hover:text-blue-500 cursor-pointer flex items-center font-poppins text-[15.5px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                <SubscriptionsIcon className="w-[15px] mr-3" />
                Subscription
              </Link>
              <Link
                to="/subscription"
                className="hover:text-blue-500 cursor-pointer flex items-center font-poppins text-[15.5px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                <FavoriteIcon className="w-[15px] mr-3" />
                Favorites
              </Link>
              <Link
                to="/faq"
                className="hover:text-blue-500 cursor-pointer flex items-center font-poppins text-[15.5px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                <InfoIcon className="w-[15px] mr-3" />
                FAQ
              </Link>
              <li
                onClick={() => onClickLogout()}
                className="hover:text-blue-500 cursor-pointer flex items-center font-poppins text-[15.5px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                <LogoutIcon className="w-[15px] mr-3" />
                Log Out
              </li>
            </ul>
            <p className="pt-10 pb-8 uppercase font-poppins font-semibold text-[12px] bg-gradient-to-r from-[#574A98] to-[#C12888] bg-clip-text text-transparent">
              discover more
            </p>
            <ul className="py-4 space-y-4">
              <Link
                to="/concept"
                className="hover:text-blue-500 cursor-pointer flex items-center font-poppins text-[15.5px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                What is Blended Soul?
              </Link>
              <Link
                to="/about"
                className="hover:text-blue-500 cursor-pointer flex items-center font-poppins text-[15.5px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                About Paul
              </Link>
              <Link
                to="/creative-lab"
                className="hover:text-blue-500 cursor-pointer flex items-center font-poppins text-[15.5px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                About Creative Lab
              </Link>
              <Link
                to="/store"
                className="hover:text-blue-500 cursor-pointer flex items-center font-poppins text-[15.5px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3"
              >
                Store
              </Link>
              <li className="hover:text-blue-500 cursor-pointer flex items-center font-poppins text-[15.5px] text-[#3F356E] font-normal border-b-[0.5px] border-[#8690FD4D] py-3">
                Website
              </li>
              <li className="hover:text-blue-500 cursor-pointer flex items-center font-poppins text-[15.5px] text-[#3F356E] font-normal py-3">
                Schedule a Session
              </li>
            </ul>
          </div>
        </Box>
      </Drawer>
      <LoadingModal open={isLoading} />
    </div>
  );
};

export default NavigationDrawer;
