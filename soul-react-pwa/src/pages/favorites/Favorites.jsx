import { useEffect, useState, useRef } from "react";
import NavigationDrawer from "../../components/NavigationDrawer";
import { siteBaseUrl } from "../../utils/constants";
import { setIsLoading } from "../../redux/appsettingSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "../../components/LoadingModal";
import { getWithParams } from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { post } from "../../utils/axios";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

const Favorites = () => {
  const hasSubmitted = useRef(false);
  const [cardFavorites, setCardFavorites] = useState([]);
  const [readFavorites, setReadFavorites] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.appsetting.isLoading);
  const userId = useSelector((state) => state.auth.user.id);
  const type = "card";
  // Tab setting
  const [value, setValue] = useState("1");
  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  const tabCss = {
    width: "50%",
    fontFamily: "Poppins",
    fontSize: "18px",
    textTransform: "none",
    color: "gray",
    borderBottom: "2px solid gray",
    "&.Mui-selected": {
      color: "white",
      fontWeight: "bold",
    },
  };

  useEffect(() => {
    const getFavorites = async () => {
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const response = await getWithParams("/all-favorites", { userId });

        setCardFavorites(
          response.data.cards.map((fav) => ({
            ...fav,
            favorited: true, // assume all returned favorites are already favorited
            type: "card",
          }))
        );

        setReadFavorites(
          response.data.readings.map((fav) => ({
            ...fav,
            type: "reading",
          }))
        );
      } catch (error) {
        console.log("Error:", error);
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };
    if (!hasSubmitted.current) {
      hasSubmitted.current = true;
      getFavorites();
    }
  }, []);

  const showCardView = (id, title, description, imgUrl, type) => {
    window.sessionStorage.setItem(type + "Id", id);
    if (type === "reading") {
      navigate(`/reading/detail/${id}`);
    } else {
      navigate(`/card/detail/${id}`);
    }
  };

  const onClickCardFavoriteIcon = (e, favoriteId) => {
    e.stopPropagation();

    const updatedCardFavorites = cardFavorites.map((fav) => {
      if (fav.id === favoriteId) {
        return { ...fav, favorited: !fav.favorited };
      }
      return fav;
    });
    setCardFavorites(updatedCardFavorites);

    // Call API to update favorite status
    post("/toggle-favorite", { userId, cardId: favoriteId, type })
      .then((response) => {
        console.log("Favorite status updated:", response.data);
      })
      .catch((error) => {
        console.error("Error updating favorite status:", error);
      });
  };

  return (
    <div className="min-h-screen favorite px-5 pt-8 pb-5">
      <div className="flex justify-between">
        <button
          className="w-12 h-12 rounded-full bg-[#8690FD] flex items-center justify-center text-white hover:bg-gray-700 transition"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon size={24} />
        </button>
        <NavigationDrawer />
      </div>
      <p className="font-poppins font-semibold text-white text-2xl text-center pt-0 pb-1">
        Favorites
      </p>

      <Box sx={{ width: "100%", typography: "body1" }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList
              onChange={handleTabChange}
              aria-label="lab API tabs example"
              TabIndicatorProps={{
                sx: {
                  backgroundColor: "#FFD141", // your desired color
                  height: "2px", // optional: change thickness
                },
              }}
            >
              <Tab label="Readings" value="1" sx={tabCss} />
              <Tab label="Cards" value="2" sx={tabCss} />
            </TabList>
          </Box>
          <TabPanel style={{ padding: "0px" }} value="2">
            <div
              className="overflow-y-auto overscroll-contain hide-scrollbar"
              style={{ maxHeight: "calc(100vh - 182px)" }}
            >
              {cardFavorites.length === 0 ? (
                <p className="font-poppins text-center text-2xl  pt-[50%]">
                  There is no card to display.
                </p>
              ) : (
                cardFavorites.map((cfavorite, index) => (
                  <div
                    key={index}
                    className="rounded-[12px] flex justify-start items-stretch bg-white py-2.5 px-[9px] mt-[10px]"
                    onClick={() =>
                      showCardView(
                        cfavorite.id,
                        cfavorite.title,
                        cfavorite.description,
                        cfavorite.card_img,
                        cfavorite.type
                      )
                    }
                  >
                    <img
                      src={siteBaseUrl + "deckcards/" + cfavorite.card_img}
                      alt={cfavorite.title}
                      className="max-w-1/4 h-[100px] mr-3"
                    />
                    <div className="flex flex-col justify-between w-full">
                      <div className="flex items-center justify-between">
                        <p className="font-poppins font-semibold text-[16px] text-[#3F356E]">
                          {cfavorite.title}
                        </p>

                        <button
                          className="w-8 h-8 rounded-full bg-[#8690FD] flex items-center justify-center text-white hover:bg-gray-700 transition"
                          onClick={(e) =>
                            onClickCardFavoriteIcon(e, cfavorite.id)
                          }
                        >
                          {cfavorite.favorited ? (
                            <FavoriteIcon sx={{ fontSize: 20 }} />
                          ) : (
                            <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                          )}
                        </button>
                      </div>
                      <p
                        className="font-poppins text-[rgba(63,53,110,0.95)] text-[14px] font-light leading-[160%] text-base line-clamp-3 text-ellipsis"
                        dangerouslySetInnerHTML={{
                          __html: cfavorite.description,
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabPanel>
          <TabPanel style={{ padding: "0px" }} value="1">
            <div
              className="overflow-y-auto overscroll-contain hide-scrollbar"
              style={{ maxHeight: "calc(100vh - 182px)" }}
            >
              {readFavorites.length === 0 ? (
                <p className="font-poppins text-center text-2xl pt-[50%]">
                  There is no reading to display.
                </p>
              ) : (
                readFavorites.map((rfavorite, index) => (
                  <div
                    key={index}
                    className="rounded-[12px] flex justify-start items-stretch bg-white py-2.5 px-[9px] mt-[10px]"
                    onClick={() =>
                      showCardView(
                        rfavorite.id,
                        rfavorite.title,
                        rfavorite.description,
                        rfavorite.img,
                        rfavorite.type
                      )
                    }
                  >
                    <img
                      src={siteBaseUrl + "reading/" + rfavorite.img}
                      alt={rfavorite.title}
                      className="max-w-1/4 h-[100px] mr-3"
                    />
                    <div className="flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <p className="font-poppins font-semibold text-4 text-[#3F356E]">
                          {rfavorite.title}
                        </p>
                      </div>
                      <p className="font-poppins text-[rgba(63,53,110,0.95)] text-[14px] font-light leading-[160%] text-base line-clamp-3 text-ellipsis">
                        {rfavorite.description}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabPanel>
        </TabContext>
      </Box>

      <LoadingModal open={isLoading} />
    </div>
  );
};
export default Favorites;
