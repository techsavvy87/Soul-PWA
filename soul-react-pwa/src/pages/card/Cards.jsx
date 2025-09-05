import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setIsLoading, setActiveCardId } from "../../redux/appsettingSlice";
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
      } catch (error) {
        console.log("Error:", error);
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };
    if (!hasSubmitted.current) {
      hasSubmitted.current = true;
      getCards();
    }
  }, []);

  return (
    <div className="h-[calc(100vh-80px)] flex items-center">
      {cards.length === 0 ? (
        <p className="font-poppins text-center text-2xl">
          There is no card to display.
        </p>
      ) : cards.length === 1 ? (
        <div className="max-w-[80%] m-auto bg-white p-[10px]">
          <img
            src={siteBaseUrl + "deckcards/" + cards[0].card_img}
            alt={`slide-0`}
            className="w-full m-auto rounded-[15px]"
            onClick={() => {
              window.sessionStorage.setItem("card", JSON.stringify(cards[0]));
              navigate("/card/fullscreen");
            }}
          />
        </div>
      ) : (
        <Swiper
          className="absolute left-1/2"
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 50000 }}
          spaceBetween={0}
          slidesPerView="auto"
          centeredSlides={true}
          loop={true}
          initialSlide={1}
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
    </div>
  );
};

export default Cards;
