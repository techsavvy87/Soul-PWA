import { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { siteBaseUrl } from "../../utils/constants";
import { getWithParams } from "../../utils/axios";
import { setIsLoading } from "../../redux/appsettingSlice";
import { useDispatch } from "react-redux";

const CardDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const renderStatus = useRef(false);
  const { id } = useParams();
  const [cardDetail, setCardDetail] = useState([]);

  useEffect(() => {
    const fetchCardDetail = async () => {
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const result = await getWithParams(`/card/detail/${id}`);
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
    <div className="text-center mt-8 mx-4">
      <div className="bg-white p-[15px]  inline-block">
        <img
          src={siteBaseUrl + "deckcards/" + cardDetail.card_img}
          alt="card"
          className="m-auto object-cover"
        />
      </div>
      <div className="px-5 py-4">
        <div
          className="overflow-y-auto overscroll-contain mt-5"
          style={{ maxHeight: "calc(100vh - 428px)" }}
        >
          <p
            className="font-poppins text-[14px] font-light text-[#302853] leading-6 pt-3"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {cardDetail.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
