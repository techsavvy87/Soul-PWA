import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate, useLocation } from "react-router-dom";

const CardBody = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { description } = location.state || {};

  return (
    <div className="min-h-screen layout-card px-5 py-10">
      <button
        className="mb-5 w-12 h-12 rounded-full bg-[#8690FD] flex items-center justify-center text-white hover:bg-gray-700 transition"
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon size={24} />
      </button>
      <p>{description}</p>
    </div>
  );
};

export default CardBody;
