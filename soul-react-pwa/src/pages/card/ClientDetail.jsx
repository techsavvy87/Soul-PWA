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
  const [imgWidthCss, setImgWidthCss] = useState("w-[190px]");

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

  // Get width and height of original image.
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth > naturalHeight) {
      setImgWidthCss("w-full");
    }
  };

  return (
    <div className="text-center mt-8 mx-4">
      <div className="inline-block">
        <img
          src={siteBaseUrl + "deckcards/" + cardDetail.card_img}
          alt="card"
          className={`${imgWidthCss} h-[285px] m-auto object-cover`}
          onLoad={handleImageLoad}
        />
      </div>
      <div className="py-4">
        <div
          className="overflow-y-auto overscroll-contain card-detail"
          style={{ maxHeight: "calc(100vh - 485px)" }}
        >
          <p
            className="text-[16px] text-[#302853]  text-left whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: cardDetail.description }}
          />
        </div>
      </div>
      <LoadingModal open={isLoading} />
    </div>
  );
};

export default CardClientDetail;
