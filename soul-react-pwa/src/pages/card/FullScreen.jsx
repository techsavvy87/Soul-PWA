import { siteBaseUrl } from "../../utils/constants";

const CardFullScreen = () => {
  const card = JSON.parse(window.sessionStorage.getItem("card"));

  return (
    <div className="full-screen">
      <div className="bg-white p-[10px] relative">
        {card?.card_img && (
          <img
            src={siteBaseUrl + "deckcards/" + card.card_img}
            alt={`Card ${card.id}`}
            className="w-full"
          />
        )}
        <p className="font-poppins font-bold text-black inline-block  absolute bottom-[5%] left-1/2 -translate-x-1/2 py-[2px] px-6 text-[20px] bg-white text-center">
          {card?.title}
        </p>
        <p className="font-bold text-black text-[20px] absolute bottom-[4%] w-15 h-15 bg-white rounded-full flex items-center justify-center">
          {card?.number}
        </p>
      </div>
    </div>
  );
};

export default CardFullScreen;
