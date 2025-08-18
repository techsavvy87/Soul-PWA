import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LoopIcon from "@mui/icons-material/Loop";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { post } from "../utils/axios";

const CardIcon = ({ isFavorited, description, userId, cardId }) => {
  const navigate = useNavigate();

  const [favoriteStatus, setFavoriteStatus] = useState();

  useEffect(() => {
    setFavoriteStatus(isFavorited);
  }, [isFavorited]);

  const handleLoopIcon = (description) => {
    navigate("/card-body", {
      state: { description: description },
    });
  };

  const onClickFavoriteIcon = () => {
    try {
      post("/toggle-favorite", { userId, cardId })
        .then((response) => {
          console.log("Favorite status updated:", response.data);
        })
        .catch((error) => {
          console.error("Error updating favorite status:", error);
        });
    } catch (error) {}
    setFavoriteStatus(!favoriteStatus);
  };

  return (
    <div className="flex mb-5 items-center justify-between">
      <button
        className="w-12 h-12 rounded-full bg-[#8690FD] flex items-center justify-center text-white hover:bg-gray-700 transition"
        onClick={() => navigate(-1)}
      >
        <ArrowBackIcon size={24} />
      </button>
      <div className="flex">
        <button
          className="w-12 h-12 rounded-full bg-[#8690FD] flex items-center justify-center text-white hover:bg-gray-700 transition"
          onClick={() => onClickFavoriteIcon()}
        >
          {favoriteStatus ? (
            <FavoriteIcon size={24} />
          ) : (
            <FavoriteBorderIcon size={24} />
          )}
        </button>
        <button
          className="w-12 h-12 ml-2 rounded-full bg-[#8690FD] flex items-center justify-center text-white hover:bg-gray-700 transition"
          onClick={() => handleLoopIcon(description)}
        >
          <LoopIcon size={24} />
        </button>
      </div>
    </div>
  );
};

export default CardIcon;
