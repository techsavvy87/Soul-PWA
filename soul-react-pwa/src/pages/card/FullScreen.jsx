import React, { useEffect } from "react";
import { siteBaseUrl } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { setPrevPageName } from "../../redux/appsettingSlice";

const CardFullScreen = () => {
  const card = JSON.parse(window.sessionStorage.getItem("card"));
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPrevPageName({ pageName: "card" }));
  }, [dispatch]);

  return (
    <div
      className="relative w-screen"
      style={{ minHeight: "calc(100vh - 150px)" }}
    >
      {card?.card_img && (
        <div className="flex justify-center relative">
          <img
            src={siteBaseUrl + "deckcards/" + card.card_img}
            alt={`Card ${card.id}`}
            className="w-auto max-w-[70vw] h-auto object-contain mt-5"
          />
          {!card.category_name.toLowerCase().includes("personality") && (
            <>
              <p
                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-bold px-[25px] py-[10px] rounded-[15px] whitespace-nowrap ${(() => {
                  const name = card.category_name.toLowerCase();

                  if (
                    ["alchemy", "sacred", "master"].some((w) =>
                      name.includes(w)
                    )
                  ) {
                    return "bg-[#0076ba]"; // A color
                  } else if (name.includes("transcend")) {
                    return "bg-[#534eb4]";
                  } else if (name.includes("release")) {
                    return "bg-[#f17201]";
                  } else {
                    return "bg-[#333]"; // fallback
                  }
                })()}`}
                style={{
                  fontSize: "clamp(18px, 3vw, 32px)", // min 18px, max 32px, scales with viewport width
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
      )}
    </div>
  );
};

export default CardFullScreen;
