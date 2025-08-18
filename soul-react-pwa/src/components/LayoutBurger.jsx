import { useSelector } from "react-redux";
import LoadingModal from "./LoadingModal";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigationDrawer from "./NavigationDrawer";

const LayoutBurger = ({ children }) => {
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.appsetting);
  return (
    <div className="min-h-screen layout-burger px-5 py-10">
      <div className="flex items-center justify-between">
        <button
          className="w-12 h-12 rounded-full bg-[#8690FD] flex items-center justify-center text-white hover:bg-gray-700 transition"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon size={24} />
        </button>
        <NavigationDrawer />
      </div>
      {children}
      <LoadingModal open={isLoading} />
    </div>
  );
};
export default LayoutBurger;
