import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setIsLoading,
  setActiveCardId,
  setExtraCards,
  setElementEmpty,
} from "../../redux/appsettingSlice";
import { post } from "../../utils/axios";
import { siteBaseUrl } from "../../utils/constants";
import LoadingModal from "../../components/LoadingModal";
import { useLocation } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const CardAdj = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { adjSort, adjIds } = location.state || { adjSort: "", adjIds: [] };
  const hasSubmitted = useRef(false);
  const [cards, setCards] = useState([]);
  const { isLoading } = useSelector((state) => state.appsetting);
  const prevPageName = useSelector((state) => state.appsetting.prevPageName);
  const storedCards = useSelector((state) => state.appsetting.cards);

  const lastCardAdjId = Number(window.sessionStorage.getItem("lastCardAdjId"));
  let initialSlideIndex = cards?.findIndex((r) => r.id === lastCardAdjId) ?? 0;

  useEffect(() => {
    const getCards = async () => {
      const url = "/get-adj-cards";
      const data = {
        adjSort,
        adjIds,
      };
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const response = await post(url, data);
        setCards(response.data.result);
        dispatch(setExtraCards({ cards: response.data.result }));

        // When there is at least one card, display icon like send, favorite, flip
        if (response.data.result.length === 0) {
          // Handle empty card list case
          dispatch(setElementEmpty({ elementEmpty: true }));
        } else {
          dispatch(setElementEmpty({ elementEmpty: false }));
        }
      } catch (error) {
        console.log("Error:", error);
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };
    if (!hasSubmitted.current) {
      hasSubmitted.current = true;
      if (prevPageName === "Adjective") {
        initialSlideIndex = 1;
        getCards();
      } else {
        if (storedCards && storedCards.length > 0) {
          setCards(storedCards);
        } else {
          initialSlideIndex = 1;
          getCards();
        }
      }
    }
  }, []);
  return (
    <div className="cardswiper">
      {cards.length === 0 ? (
        <p className="font-poppins text-center text-[#3F356E] text-2xl pt-[50%]">
          There is no card to display.
        </p>
      ) : cards.length === 1 ? (
        <div className="w-full">
          <img
            src={siteBaseUrl + "deckcards/" + cards[0].card_img}
            alt={`slide-0`}
            className="max-w-[80%] m-auto rounded-[15px]"
            onClick={() => {
              window.sessionStorage.setItem("card", JSON.stringify(cards[0]));
              navigate("/card/fullscreen");
            }}
          />
        </div>
      ) : (
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={true}
          spaceBetween={0}
          centeredSlides={true}
          slidesPerView={"auto"}
          initialSlide={initialSlideIndex}
          style={{ padding: "0 60px" }}
          onRealIndexChange={(swiper) => {
            // Get the real index in loop mode
            const realIndex = swiper.realIndex;
            const currentCard = cards?.[realIndex];
            if (!currentCard) {
              console.warn("Card not found for index:", realIndex);
              return;
            }
            dispatch(setActiveCardId({ cardId: currentCard.id }));
            window.sessionStorage.setItem("cardId", currentCard.id);
            // Save to sessionStorage so it persists across pages
            window.sessionStorage.setItem("lastCardAdjId", currentCard.id);
          }}
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index} style={{ width: "100%" }}>
              <img
                src={siteBaseUrl + "deckcards/" + card.card_img}
                alt={`slide-${index}`}
                className="w-full m-auto rounded-[15px] object-cover"
                onClick={() => {
                  window.sessionStorage.setItem("card", JSON.stringify(card));
                  navigate("/card/fullscreen");
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <LoadingModal open={isLoading} />
    </div>
  );
};

export default CardAdj;
