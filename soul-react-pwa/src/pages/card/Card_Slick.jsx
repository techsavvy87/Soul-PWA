import { useEffect, useState, useRef } from "react";
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

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Cards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasSubmitted = useRef(false);
  const sliderRef = useRef(null);

  const [cards, setCards] = useState([]);
  const prevPageName = useSelector((state) => state.appsetting.prevPageName);
  const storedCards = useSelector((state) => state.appsetting.cards);

  const sacCardDeckNameCss =
    "bg-gray-500 opacity-70 px-[15px] py-[5px] rounded-[10px]";

  const lastCardId = Number(window.localStorage.getItem("lastCardId"));
  const initialSlideIndex = Math.max(
    cards?.findIndex((r) => r.id === lastCardId),
    0
  );
  // Set the active card ID and localStorage on initial render
  if (cards && cards.length > 0) {
    const initialSlideIndex = Math.max(
      cards.findIndex((r) => r.id === lastCardId),
      0
    );

    dispatch(
      setActiveCardId({
        cardId: cards[initialSlideIndex].id,
      })
    );
  }

  useEffect(() => {
    let tier = localStorage.getItem("tier");
    let type = localStorage.getItem("type");
    let name = localStorage.getItem("eventName");
    let id = localStorage.getItem("eventId");

    const getCards = async () => {
      const url = "/get-cards";
      const data = { tier, type, name, id };
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const response = await post(url, data);
        if (response.data.result.length === 1) {
          dispatch(setActiveCardId({ cardId: response.data.result[0].id }));
          window.localStorage.setItem("cardId", response.data.result[0].id);
        }

        setCards(response.data.result);
        dispatch(setExtraCards({ cards: response.data.result }));
        if (response.data.result.length === 0) {
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
        getCards();
      } else {
        if (storedCards && storedCards.length > 0) {
          setCards(storedCards);
        } else {
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

  // react-slick slider settings
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 5000,
    centerMode: true,
    centerPadding: "60px",
    initialSlide: initialSlideIndex,
    beforeChange: (oldIndex, newIndex) => {
      const currentCard = cards[newIndex];
      if (currentCard) {
        dispatch(setActiveCardId({ cardId: currentCard.id }));
        window.localStorage.setItem("cardId", currentCard.id);
        window.localStorage.setItem("lastCardId", currentCard.id);
      }
    },
  };

  return (
    <div className="cardswiper">
      {cards.length === 0 ? (
        <p className="font-poppins text-center text-[#3F356E] text-2xl pt-[50%]">
          There is no card to display.
        </p>
      ) : cards.length === 1 ? (
        <div
          className="max-w-[70%] m-auto relative cursor-pointer"
          onClick={() => {
            window.localStorage.setItem("card", JSON.stringify(cards[0]));
            navigate("/card/fullscreen");
          }}
        >
          <img
            src={siteBaseUrl + "deckcards/" + cards[0].card_img}
            alt={`slide-0`}
            className="w-full m-auto"
          />
          {!cards[0].category_name.toLowerCase().includes("personality") && (
            <>
              <p
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[18px] font-bold px-[25px] py-[10px] rounded-[15px] whitespace-nowrap
                  ${getCategoryBg(cards[0].category_name)}`}
              >
                {cards[0].title}
              </p>

              <p
                className={`text-white absolute bottom-7 left-1/2 -translate-x-1/2 text-center whitespace-nowrap
                  ${
                    cards[0].category_name.toLowerCase().includes("sacred")
                      ? sacCardDeckNameCss
                      : ""
                  }`}
              >
                {cards[0].category_name}
              </p>
            </>
          )}
        </div>
      ) : (
        <Slider ref={sliderRef} {...settings}>
          {cards.map((card, index) => (
            <div key={index} className="relative px-[10px]">
              <div
                className="relative cursor-pointer"
                onClick={() => {
                  window.localStorage.setItem("card", JSON.stringify(card));
                  window.localStorage.setItem("cardId", card.id);
                  window.localStorage.setItem("lastCardId", card.id);
                  navigate("/card/fullscreen");
                }}
              >
                <img
                  src={siteBaseUrl + "deckcards/" + card.card_img}
                  alt={`slide-${index}`}
                  className="w-full m-auto object-cover rounded-[10px]"
                />
                {!card.category_name.toLowerCase().includes("personality") && (
                  <>
                    <p
                      className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[18px] font-bold px-[25px] py-[10px] rounded-[15px] whitespace-nowrap
                        ${getCategoryBg(card.category_name)}`}
                    >
                      {card.title}
                    </p>

                    <p
                      className={`text-white absolute bottom-7 left-1/2 -translate-x-1/2 text-center whitespace-nowrap
                        ${
                          card.category_name.toLowerCase().includes("sacred")
                            ? sacCardDeckNameCss
                            : ""
                        }`}
                    >
                      {card.category_name}
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};
export default Cards;
