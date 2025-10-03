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
      <div className="flex justify-center">
        {card?.card_img && (
          <img
            src={siteBaseUrl + "deckcards/" + card.card_img}
            alt={`Card ${card.id}`}
            className="w-auto max-w-[70vw] h-auto object-contain mt-5"
          />
        )}
      </div>
    </div>
  );
};

export default CardFullScreen;
