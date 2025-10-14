import React, { useEffect } from "react";
import { siteBaseUrl } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { setPrevPageName } from "../../redux/appsettingSlice";
import { useNavigate } from "react-router-dom";

const CardFullScreen = () => {
  const card = JSON.parse(window.localStorage.getItem("card"));
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sacCardDeckNameCss =
    "bg-gray-500 opacity-70 px-[15px] py-[5px] rounded-[10px]";

  useEffect(() => {
    dispatch(setPrevPageName({ pageName: "card" }));
  }, [dispatch]);

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

  return (
    <div
      className="relative w-screen"
      style={{ minHeight: "calc(100vh - 150px)" }}
    >
      {card?.card_img && (
        <div
          className="flex justify-center relative"
          onClick={() => navigate("/card/detail/" + card.id)}
        >
          <img
            src={siteBaseUrl + "deckcards/" + card.card_img}
            alt={`Card ${card.id}`}
            className="w-full h-auto object-contain mt-5 px-5"
          />
          {card.category_name.toLowerCase().includes("transcend") ? (
            <>
              <p className="text-white text-[20px] absolute top-13 left-1/2 -translate-x-1/2 text-center whitespace-nowrap">
                {card.category_name}
              </p>
              <p
                className={`absolute bottom-2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[18px] font-bold px-[25px] py-[10px] rounded-[15px] whitespace-nowrap
                                ${getCategoryBg(card.category_name)}`}
              >
                {card.title}
              </p>
            </>
          ) : (
            !card.category_name.toLowerCase().includes("personality") && (
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
                          }
                        `}
                >
                  {card.category_name}
                </p>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CardFullScreen;
