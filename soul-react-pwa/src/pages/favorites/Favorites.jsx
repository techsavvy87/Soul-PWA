import { useEffect, useState, useRef } from "react";
import NavigationDrawer from "../../components/NavigationDrawer";
import { siteBaseUrl } from "../../utils/constants";
import { setIsLoading } from "../../redux/appsettingSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "../../components/LoadingModal";
import { getWithParams } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Favorites = () => {
  const hasSubmitted = useRef(false);
  const [favorites, setFavorites] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.appsetting.isLoading);
  const user_id = useSelector((state) => state.auth.user.id);

  useEffect(() => {
    const getFavorites = async () => {
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const response = await getWithParams("/all-favorites", { user_id });

        setFavorites(response.data.favorites);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };
    if (!hasSubmitted.current) {
      hasSubmitted.current = true;
      getFavorites();
    }
  }, []);

  const showCardView = (id, title, description, imgUrl) => {
    window.sessionStorage.setItem("cardId", id);
    navigate("/card-view", {
      state: { title, description, imgUrl },
    });
  };
  return (
    <div className="min-h-screen favorite px-5 py-10">
      <div className="flex justify-between">
        <button
          className="mb-5 w-12 h-12 rounded-full bg-[#8690FD] flex items-center justify-center text-white hover:bg-gray-700 transition"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon size={24} />
        </button>
        <NavigationDrawer />
      </div>
      <p className="font-poppins font-semibold text-white text-2xl text-center pt-5 pb-5">
        Favorites
      </p>
      {favorites.map((favorite, index) => (
        <div
          key={index}
          className="rounded-[12px] flex justify-start items-stretch bg-white py-5 px-[9px] mb-[10px]"
          onClick={() =>
            showCardView(
              favorite.id,
              favorite.title,
              favorite.description,
              favorite.card_img
            )
          }
        >
          <img
            src={siteBaseUrl + "deckcards/" + favorite.card_img}
            alt={favorite.title}
            className="max-w-1/4 mr-3"
          />
          <div className="flex flex-col justify-between">
            <p className="font-poppins font-semibold text-4 text-[#3F356E] mb-[10px]">
              {favorite.title}
            </p>
            <p className="font-poppins text-[rgba(63,53,110,0.95)] text-[14px] font-light leading-[160%] text-base line-clamp-4">
              {favorite.description}
            </p>
          </div>
        </div>
      ))}
      <LoadingModal open={isLoading} />
    </div>
  );
};
export default Favorites;
