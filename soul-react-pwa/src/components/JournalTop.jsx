import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigationDrawer from "./NavigationDrawer";
import { useNavigate } from "react-router-dom";

const JournalTop = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-between items-center">
      <ArrowBackIcon
        sx={{ fontSize: 35, color: "#3F356E" }}
        onClick={() => navigate(-1)}
      />
      <NavigationDrawer />
    </div>
  );
};

export default JournalTop;
