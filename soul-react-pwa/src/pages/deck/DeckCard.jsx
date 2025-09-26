import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { get } from "../../utils/axios";
import LoadingModal from "../../components/LoadingModal";
import { setIsLoading } from "../../redux/appsettingSlice";
import { siteBaseUrl } from "../../utils/constants";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NavigationDrawer from "../../components/NavigationDrawer";

const DeckCard = () => {
  const { id } = useParams();
  const [cards, setCards] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useSelector((state) => state.appsetting);
  const deckTitle = location.state?.deckTitle;

  useEffect(() => {
    const fetchDeck = async () => {
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const response = await get(`/deck-cards/${id}`);

        setCards(response.data.result);
      } catch (error) {
        console.error("Error fetching deck:", error);
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };
    fetchDeck();
  }, []);

  const showCardView = (card_id, title, description, imgUrl) => {
    window.sessionStorage.setItem("cardId", card_id);
    window.sessionStorage.setItem("description", description);

    navigate("/card/detail/" + card_id);
  };

  return (
    <div className="min-h-screen favorite px-5 py-10">
      <div className="flex justify-between">
        <button
          className="w-12 h-12 rounded-full bg-[#8690FD] flex items-center justify-center text-white hover:bg-gray-700 transition"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon size={24} />
        </button>
        <NavigationDrawer />
      </div>
      <p className="font-poppins font-semibold text-white text-2xl text-center py-2.5">
        {deckTitle}'s Cards
      </p>
      <div
        className="overflow-y-auto overscroll-contain hide-scrollbar"
        style={{ maxHeight: "calc(100vh - 182px)" }}
      >
        {cards.map((card, index) => (
          <div
            className="relative"
            key={index}
            onClick={() =>
              showCardView(card.id, card.title, card.description, card.card_img)
            }
          >
            <div
              className={`rounded-[12px] flex justify-start items-stretch bg-white py-2.5 px-[9px] mb-[10px]`}
              key={index}
            >
              <img
                src={siteBaseUrl + "deckcards/" + card.card_img}
                alt={card.title}
                className="w-[50px] h-[100px] mr-3"
              />
              <div className="flex flex-col justify-between">
                <p className="font-poppins font-semibold text-[16px] text-[#3F356E] mb-[10px]">
                  {card.title}
                </p>
                <p
                  className="font-poppins text-[rgba(63,53,110,0.95)] text-[14px] font-light leading-[160%] text-base line-clamp-3 text-ellipsis"
                  dangerouslySetInnerHTML={{ __html: card.description }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <LoadingModal open={isLoading} />
    </div>
  );
};

export default DeckCard;
