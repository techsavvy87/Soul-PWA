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
    <div className="relative w-screen" style={{ height: "calc(100vh - 80px)" }}>
      <div
        className="absolute left-1/2 fullscreen"
        style={{
          top: "40%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {card?.card_img && (
          <img
            src={siteBaseUrl + "deckcards/" + card.card_img}
            alt={`Card ${card.id}`}
            className="w-auto max-w-[90vw] object-contain"
            style={{
              maxHeight: "calc(100% - 0px)",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CardFullScreen;
