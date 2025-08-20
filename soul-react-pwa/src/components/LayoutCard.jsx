import { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LoopIcon from "@mui/icons-material/Loop";
import { useSelector } from "react-redux";
import LoadingModal from "./LoadingModal";
import { post } from "../utils/axios";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const LayoutCard = ({ children }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { isLoading } = useSelector((state) => state.appsetting);
  const userId = useSelector((state) => state.auth.user.id);
  const cardId = window.sessionStorage.getItem("cardId");

  const navigate = useNavigate();

  const onClickFavoriteIcon = () => {
    console.log("kch");
    try {
      post("/toggle-favorite", { userId, cardId })
        .then((response) => {
          console.log("Favorite status updated:", response.data);
        })
        .catch((error) => {
          console.error("Error updating favorite status:", error);
        });
    } catch (error) {}
    setIsFavorited(!isFavorited);
  };

  useEffect(() => {
    const checkIfFavorited = async () => {
      try {
        const result = await post("/check-favorite", { userId, cardId });
        setIsFavorited(result.data.isFavorited);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };
    checkIfFavorited();
  }, [userId, cardId]);

  return (
    <div className="min-h-screen layout-card px-5 py-10">
      <div className="flex items-center justify-between  mb-5">
        <ArrowBackIcon
          sx={{ fontSize: 35, color: "#8690FD" }}
          onClick={() => navigate(-1)}
        />

        <div className="flex">
          <button
            className="w-12 h-12 rounded-full bg-[#8690FD] flex items-center justify-center text-white hover:bg-gray-700 transition"
            onClick={() => onClickFavoriteIcon()}
          >
            {isFavorited ? (
              <FavoriteIcon size={24} />
            ) : (
              <FavoriteBorderIcon size={24} />
            )}
          </button>
        </div>
      </div>
      {children}
      <LoadingModal open={isLoading} />
    </div>
  );
};
export default LayoutCard;
