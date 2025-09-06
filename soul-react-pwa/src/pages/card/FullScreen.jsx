import { siteBaseUrl } from "../../utils/constants";

const CardFullScreen = () => {
  const card = JSON.parse(window.sessionStorage.getItem("card"));

  return (
    <div className="relative w-screen" style={{ height: "calc(100vh - 80px)" }}>
      <div
        className="absolute left-1/2"
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
