import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { get } from "../../utils/axios";
import LoadingModal from "../../components/LoadingModal";
import { setIsLoading } from "../../redux/appsettingSlice";
import { siteBaseUrl } from "../../utils/constants";
import AppHeader from "../../components/AppHeader";
import SubHeader from "../../components/SubHeader";

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
        if (!navigator.onLine) {
          console.warn("Offline: loading cached deck...");

          // Try to get cached deck data by ID
          const cachedDecks = JSON.parse(
            localStorage.getItem("cachedDecksById") || "{}"
          );
          if (cachedDecks[id]) {
            setCards(cachedDecks[id]);
          } else {
            console.warn("No cached data found for this deck.");
          }

          dispatch(setIsLoading({ isLoading: false }));
          return;
        }

        // Online: fetch from API
        const response = await get(`/deck-cards/${id}`);
        const deckCards = response.data.result;

        // Update state
        setCards(deckCards);

        // Cache it locally by ID
        const cachedDecks = JSON.parse(
          localStorage.getItem("cachedDecksById") || "{}"
        );
        cachedDecks[id] = deckCards;
        localStorage.setItem("cachedDecksById", JSON.stringify(cachedDecks));
      } catch (error) {
        console.error("Error fetching deck:", error);

        // Try fallback cache on error
        const cachedDecks = JSON.parse(
          localStorage.getItem("cachedDecksById") || "{}"
        );
        if (cachedDecks[id]) {
          setCards(cachedDecks[id]);
        }
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };

    fetchDeck();
  }, [id]);

  const showCardView = (card_id, title, description, imgUrl) => {
    window.localStorage.setItem("cardId", card_id);
    window.localStorage.setItem("description", description);

    navigate("/card/detail/" + card_id);
  };

  return (
    <div className="min-h-screen favorite px-5 py-10">
      <AppHeader />
      <SubHeader pageName="Cards" textColor="white" />
      <div
        className="overflow-y-auto overscroll-contain hide-scrollbar"
        style={{ maxHeight: "calc(100vh - 202px)" }}
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
                className="max-w-1/4 h-[100px] mr-3"
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
