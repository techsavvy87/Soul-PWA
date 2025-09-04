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
    <div>
      {cards.length === 1 ? (
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
          <p className="font-poppins font-bold text-black inline-block  absolute bottom-[5%] left-1/2 -translate-x-1/2 py-1 px-6 text-[13px] bg-white text-center">
            {cards[0].title}
          </p>
          <p className="font-bold text-black absolute bottom-[4%] w-10 h-10 bg-white rounded-full flex items-center justify-center">
            {cards[0].number}
          </p>
        </div>
      ) : (
        <Swiper
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
              <p className="font-poppins font-bold text-black inline-block  absolute bottom-[5%] left-1/2 -translate-x-1/2 py-1 px-6 text-[13px] bg-white text-center">
                {card.title}
              </p>
              <p className="font-bold text-black absolute bottom-[4%] w-10 h-10 bg-white rounded-full flex items-center justify-center">
                {card.number}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default Cards;
