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
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Cards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasSubmitted = useRef(false);
  const [cards, setCards] = useState([]);
  const prevPageName = useSelector((state) => state.appsetting.prevPageName);
  const storedCards = useSelector((state) => state.appsetting.cards);
  const { isLoading } = useSelector((state) => state.appsetting);

  const lastCardId = Number(window.sessionStorage.getItem("lastCardId"));
  let initialSlideIndex = cards?.findIndex((r) => r.id === lastCardId) ?? 0;

  useEffect(() => {
    let tier = sessionStorage.getItem("tier");
    let type = sessionStorage.getItem("type");
    let name = sessionStorage.getItem("eventName");
    let id = sessionStorage.getItem("eventId");
    const getCards = async () => {
      const url = "/get-cards";
      const data = {
        tier,
        type,
        name,
        id,
      };
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const response = await post(url, data);
        if (response.data.result.length === 1) {
          window.sessionStorage.setItem("cardId", response.data.result[0].id);
        }
        setCards(response.data.result);
        dispatch(setExtraCards({ cards: response.data.result }));
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
      if (prevPageName === "home") {
        initialSlideIndex = 1; // Always start from the second slide when coming from burger menu
        getCards();
      } else {
        if (storedCards && storedCards.length > 0) {
          setCards(storedCards);
        } else {
          initialSlideIndex = 1; // Always start from the second slide when coming from burger menu
          getCards();
        }
      }
    }
  }, []);

  // Helper function to get background color class
  const getCategoryBg = (categoryName) => {
    const name = categoryName.toLowerCase();

    if (["alchemy", "sacred", "master"].some((w) => name.includes(w))) {
      return "bg-[#0076ba]";
    } else if (name.includes("transcend")) {
      return "bg-[#534eb4]";
    } else if (name.includes("release")) {
      return "bg-[#f17201]";
    } else {
      return "bg-[#333]";
    }
  };

  // Don't render until API finishes
  if (isLoading) {
    return null; // or return <Spinner /> if you want a loader
  }

  return (
    <div className="cardswiper">
      {cards.length === 0 ? (
        <p className="font-poppins text-center text-[#3F356E] text-2xl pt-[50%]">
          There is no card to display.
        </p>
      ) : cards.length === 1 ? (
        <div className="max-w-[70%] m-auto bg-white p-[10px]">
          <img
            src={siteBaseUrl + "deckcards/" + cards[0].card_img}
            alt={`slide-0`}
            className="w-full m-auto"
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
          // autoplay={{ delay: 5000 }}
          spaceBetween={0}
          slidesPerView="auto"
          centeredSlides={true}
          loop={true}
          initialSlide={initialSlideIndex}
          style={{ padding: "0 60px" }}
          onSwiper={(swiper) => {
            // Run once on mount to save the initial card
            const realIndex = swiper.realIndex;
            const currentCard = cards?.[realIndex];
            if (currentCard) {
              dispatch(setActiveCardId({ cardId: currentCard.id }));
              window.sessionStorage.setItem("cardId", currentCard.id);
              window.sessionStorage.setItem("lastCardId", currentCard.id);
            }
          }}
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
            window.sessionStorage.setItem("lastCardId", currentCard.id);
          }}
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index} style={{ width: "100%" }}>
              <div className="relative">
                <img
                  src={siteBaseUrl + "deckcards/" + card.card_img}
                  alt={`slide-${index}`}
                  className="w-full m-auto object-cover"
                  onClick={() => {
                    window.sessionStorage.setItem("card", JSON.stringify(card));
                    navigate("/card/fullscreen");
                  }}
                />
                {!card.category_name.toLowerCase().includes("personality") && (
                  <>
                    <p
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold px-[25px] py-[10px] rounded-[15px] 
                                ${getCategoryBg(card.category_name)}`}
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      {card.title}
                    </p>

                    <p className="text-white w-full absolute bottom-7 left-1/2 -translate-x-1/2 text-center">
                      {card.category_name}
                    </p>
                  </>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Cards;
