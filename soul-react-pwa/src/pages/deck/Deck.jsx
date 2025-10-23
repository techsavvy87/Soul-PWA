import { useEffect, useState, useRef } from "react";
import { get } from "../../utils/axios";
import { siteBaseUrl } from "../../utils/constants";
import { setIsLoading } from "../../redux/appsettingSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "../../components/LoadingModal";
import lock from "../../assets/imgs/lock.png";
import { useNavigate } from "react-router-dom";
import AppHeader from "../../components/AppHeader";
import SubHeader from "../../components/SubHeader";
import Popup from "../../components/Popup";

const Deck = () => {
  const [decks, setDecks] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hasSubmitted = useRef(false);

  const { isLoading } = useSelector((state) => state.appsetting);
  const userTier = useSelector((state) => state.auth.tier);

  useEffect(() => {
    const getDecks = async () => {
      dispatch(setIsLoading({ isLoading: true }));

      try {
        if (!navigator.onLine) {
          console.warn("Offline: Loading cached decks...");

          // Try to load cached decks from localStorage or IndexedDB
          const cachedDecks = localStorage.getItem("cachedDecks");
          if (cachedDecks) {
            setDecks(JSON.parse(cachedDecks));
          } else {
            console.warn("No cached decks found.");
          }

          dispatch(setIsLoading({ isLoading: false }));
          return;
        }

        // Online case → fetch from API
        const response = await get("/all-decks");
        const decksData = response.data.result;

        // Update state and cache
        setDecks(decksData);
        localStorage.setItem("cachedDecks", JSON.stringify(decksData));
      } catch (error) {
        console.log("Error fetching decks:", error);

        // On API error → load cache as fallback
        const cachedDecks = localStorage.getItem("cachedDecks");
        if (cachedDecks) {
          setDecks(JSON.parse(cachedDecks));
        }
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };

    if (!hasSubmitted.current) {
      hasSubmitted.current = true;
      getDecks();
    }
  }, []);

  const handleClosePopup = () => {
    setAnchorEl(null);
  };
  return (
    <div className="min-h-screen favorite px-5 py-10">
      <AppHeader />
      <SubHeader pageName="Decks" textColor="white" />
      <div
        className="overflow-y-auto overscroll-contain hide-scrollbar"
        style={{ maxHeight: "calc(100vh - 186px)" }}
      >
        {decks.map((deck, index) => (
          <div
            className="relative rounded-[12px] flex justify-start items-stretch bg-white py-2.5 px-[9px] mb-[10px]"
            key={index}
            onClick={(e) => {
              if (userTier === "free" && deck.level === "Paid") {
                setAnchorEl(e.currentTarget);
                return;
              }
              navigate(`/deck/${deck.id}`, {
                state: { deckTitle: deck.cname },
              });
            }}
          >
            <img
              src={siteBaseUrl + "decks/" + deck.info_img}
              alt={deck.cname}
              className="max-w-1/4 h-[100px] mr-3"
            />
            <div className="flex flex-col justify-between">
              <p className="font-poppins font-semibold text-[16px] text-[#3F356E] mb-[10px]">
                {deck.cname}
              </p>
              <p className="font-poppins text-[rgba(63,53,110,0.95)] text-[14px] font-light leading-[160%] text-base line-clamp-3 overflow-hidden text-ellipsis">
                {deck.info_description}
              </p>
            </div>
            {userTier === "free" && deck.level === "Paid" ? (
              <>
                <div className="absolute inset-0 rounded-[12px] bg-black/50"></div>
                <img
                  src={lock}
                  className="w-[30px] h-auto absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  logo="locked"
                />
              </>
            ) : null}
          </div>
        ))}
      </div>
      <LoadingModal open={isLoading} />
      <Popup anchorEl={anchorEl} onClose={handleClosePopup} />
    </div>
  );
};
export default Deck;
