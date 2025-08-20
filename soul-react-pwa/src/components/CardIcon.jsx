import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import LoopIcon from "@mui/icons-material/Loop";
import { post } from "../utils/axios";

const CardIcon = ({
  isFavorited,
  description,
  userId,
  cardId,
  title,
  imgUrl,
}) => {
  const navigate = useNavigate();

  const [favoriteStatus, setFavoriteStatus] = useState();

  useEffect(() => {
    setFavoriteStatus(isFavorited);
  }, [isFavorited]);

  const showCardView = () => {
    window.sessionStorage.setItem("cardId", cardId);
    window.sessionStorage.setItem("description", description);

    navigate("/card-view", {
      state: { title, description, imgUrl },
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
    <div className="flex items-center justify-end mb-5">
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
        onClick={() => showCardView()}
      >
        <LoopIcon size={24} />
      </button>
    </div>
  );
};

export default CardIcon;
