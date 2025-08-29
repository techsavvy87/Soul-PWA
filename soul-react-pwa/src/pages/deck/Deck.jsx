import { useEffect, useState, useRef } from "react";
import NavigationDrawer from "../../components/NavigationDrawer";
import { get } from "../../utils/axios";
import { siteBaseUrl } from "../../utils/constants";
import { setIsLoading } from "../../redux/appsettingSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "../../components/LoadingModal";
import lock from "../../assets/imgs/lock.png";
import Tooltip from "@mui/material/Tooltip";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const Deck = () => {
  const [decks, setDecks] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasSubmitted = useRef(false);

  const { isLoading } = useSelector((state) => state.appsetting);
  const userTier = useSelector((state) => state.auth.tier);

  useEffect(() => {
    const getDecks = async () => {
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const response = await get("/all-decks");
        setDecks(response.data.result);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };
    if (!hasSubmitted.current) {
      hasSubmitted.current = true;
      getDecks();
    }
  }, []);

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
        Decks
      </p>
      {decks.map((deck, index) => (
        <div className="relative" key={index}>
          <div
            className={`rounded-[12px] ${
              userTier === "Free" && deck.level === "Paid" ? "blur-[3px]" : ""
            }  flex justify-start items-stretch bg-white py-5 px-[9px] mb-[20px]`}
            key={index}
            onClick={() =>
              userTier === "Free" && deck.level === "Paid"
                ? navigate("/subscription")
                : navigate(`/deck/${deck.id}`, {
                    state: { deckTitle: deck.info_title },
                  })
            }
          >
            <img
              src={siteBaseUrl + "decks/" + deck.info_img}
              alt={deck.info_title}
              className="max-w-1/4 mr-3"
            />
            <div className="flex flex-col justify-between">
              <p className="font-poppins font-semibold text-4 text-[#3F356E] mb-[10px]">
                {deck.info_title}
              </p>
              <p className="font-poppins text-[rgba(63,53,110,0.95)] text-[14px] font-light leading-[160%] text-base line-clamp-5">
                {deck.info_description}
              </p>
            </div>
          </div>
          {userTier === "Free" && deck.level === "Paid" ? (
            <>
              <img
                src={lock}
                className="absolute top-[42%] left-[47%]"
                logo="locked"
              />
              <p className="absolute bottom-[15%] left-[30%] font-poppins">
                Included in Blended Soul Unlimited
              </p>
            </>
          ) : null}
        </div>
      ))}
      <LoadingModal open={isLoading} />
    </div>
  );
};
export default Deck;
