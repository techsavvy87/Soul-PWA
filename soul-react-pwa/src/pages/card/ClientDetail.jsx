import { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { siteBaseUrl } from "../../utils/constants";
import { setIsLoading } from "../../redux/appsettingSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { baseURL } from "../../utils/constants";
import LoadingModal from "../../components/LoadingModal";

const CardClientDetail = () => {
  const dispatch = useDispatch();
  const renderStatus = useRef(false);
  const { id } = useParams();
  const [cardDetail, setCardDetail] = useState([]);
  const { isLoading } = useSelector((state) => state.appsetting);

  useEffect(() => {
    const fetchCardDetail = async () => {
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const result = await axios.get(`${baseURL}/card/client-detail/${id}`);
        setCardDetail(result.data.data);
      } catch (error) {
        console.error("Error fetching card detail:", error);
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };

    if (!renderStatus.current) {
      fetchCardDetail();
      renderStatus.current = true;
    }
  }, [id]);

  return (
    <div className="min-h-screen layout-card px-5 py-10 flex flex-col justify-center">
      <div className="text-center">
        <div className="bg-white p-[15px] relative inline-block mb-[10%]">
          <img
            src={siteBaseUrl + "deckcards/" + cardDetail.card_img}
            alt="card"
            className="w-[190px] h-[285px] object-f m-auto object-cover"
          />
          <p className="font-poppins font-bold text-black inline-block  absolute bottom-[4%] left-1/2 -translate-x-1/2 py-[2px] px-3 text-[14px] bg-white text-center">
            {cardDetail.title}
          </p>
          <p className="font-bold text-black text-[20px] absolute bottom-[3%] w-11 h-11 bg-white rounded-full flex items-center justify-center">
            {cardDetail.number}
          </p>
        </div>
        <p className="font-poppins text-[14px] font-light text-[#302853] leading-[160%] break-words text-left">
          {cardDetail.description}
        </p>
      </div>
      <LoadingModal open={isLoading} />
    </div>
  );
};

export default CardClientDetail;
