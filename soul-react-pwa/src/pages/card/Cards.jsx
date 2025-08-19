import { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setIsLoading } from "../../redux/appsettingSlice";
import { post } from "../../utils/axios";
import { siteBaseUrl } from "../../utils/constants";
import CardIcon from "../../components/CardIcon";
import LoadingModal from "../../components/LoadingModal";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Cards = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasSubmitted = useRef(false);
  const [cards, setCards] = useState([]);
  const [isFavorited, setIsFavorited] = useState(false);
  const userId = useSelector((state) => state.auth.user.id);
  const [cardId, setCardId] = useState(null);
  const { isLoading } = useSelector((state) => state.appsetting);

  // Check if the card is favorited
  useEffect(() => {
    const checkIfFavorited = async () => {
      try {
        const result = await post("/check-favorite", { userId, cardId });
        setIsFavorited(result.data.isFavorited);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };
    checkIfFavorited();
  }, [userId, cardId]);

  const showCardView = (id, title, description, imgUrl) => {
    window.sessionStorage.setItem("cardId", id);
    window.sessionStorage.setItem("description", description);

    navigate("/card-view", {
      state: { title, description, imgUrl },
    });
  };

  useEffect(() => {
    let tier = sessionStorage.getItem("tier");
    let type = sessionStorage.getItem("type");
    let name = sessionStorage.getItem("eventName");
    const getCards = async () => {
      const url = "/get-cards";
      const data = {
        tier,
        type,
        name,
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
    <div className="min-h-screen layout-card px-5 py-10">
      <ArrowBackIcon
        sx={{ fontSize: 35, color: "#8690FD" }}
        onClick={() => navigate(-1)}
      />

      {cards.length === 1 ? (
        <div className="w-full">
          <CardIcon
            isFavorited={isFavorited}
            description={cards[0].description}
            userId={user_id}
            cardId={cards[0].id}
          />
          <img
            src={siteBaseUrl + "deckcards/" + cards[0].card_img}
            alt={`slide-0`}
            className="max-w-[80%] m-auto rounded-[15px]"
            onClick={() =>
              showCardView(
                cards[0].id,
                cards[0].title,
                cards[0].description,
                cards[0].card_img
              )
            }
          />
          <p className="font-poppins font-semibold text-2xl text-center text-[#3F356E]">
            {cards[0].title}
          </p>
        </div>
      ) : (
        <Swiper
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          loop={true}
          spaceBetween={0}
          slidesPerView={1}
          onRealIndexChange={(swiper) => {
            // Get the real index in loop mode
            const realIndex = swiper.realIndex;
            const currentCard = cards?.[realIndex];
            if (!currentCard) {
              console.warn("Card not found for index:", realIndex);
              return;
            }
            setCardId(currentCard.id);
          }}
        >
          {cards.map((card, index) => (
            <SwiperSlide key={index}>
              <CardIcon
                isFavorited={isFavorited}
                description={card.description}
                userId={userId}
                cardId={card.id}
              />
              <img
                src={siteBaseUrl + "deckcards/" + card.card_img}
                alt={`slide-${index}`}
                className="max-w-[80%] m-auto rounded-[15px]"
                onClick={() =>
                  showCardView(
                    card.id,
                    card.title,
                    card.description,
                    card.card_img
                  )
                }
              />
              <p className="font-poppins font-semibold text-2xl text-center text-[#3F356E]">
                {card.title}
              </p>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      <LoadingModal open={isLoading} />
    </div>
  );
};

export default Cards;
