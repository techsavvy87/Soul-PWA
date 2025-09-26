import { useSelector } from "react-redux";
import LoadingModal from "./LoadingModal";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigationDrawer from "./NavigationDrawer";

const LayoutBurger = ({ children }) => {
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.appsetting);
  return (
    <div className="min-h-screen layout-burger px-5 pt-8 pb-5">
      {/* <div className="sticky top-0 mx-4"> */}
      <div className="flex items-center justify-between">
        <ArrowBackIcon
          className="text-[#8690FD] !w-[35px] !h-[35px]"
          onClick={() => navigate(-1)}
        />
        <NavigationDrawer />
      </div>
      {/* </div> */}
      {children}
      <LoadingModal open={isLoading} />
    </div>
  );
};
export default LayoutBurger;
