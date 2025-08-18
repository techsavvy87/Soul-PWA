import { useLocation } from "react-router-dom";
import { siteBaseUrl } from "../../utils/constants";

const CardView = () => {
  const location = useLocation();
  const { title, description, imgUrl } = location.state;

  return (
    <div>
      <img
        src={siteBaseUrl + "deckcards/" + imgUrl}
        alt="card"
        className="w-[148px] h-[275px] m-auto pt-3"
      />
      <p className="my-5 font-poppins text-2xl text-[#3F356E] text-center font-semibold">
        {title}
      </p>
      <p className="font-poppins text-[14px] font-light text-[#302853] leading-[160%] break-words">
        {description}
      </p>
    </div>
  );
};

export default CardView;
