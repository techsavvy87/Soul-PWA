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
  const [imgWidthCss, setImgWidthCss] = useState("w-[190px]");

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

  // Get width and height of original image.
  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalWidth > naturalHeight) {
      setImgWidthCss("w-full");
    }
  };

  return (
    <div className="text-center mt-8 mx-4">
      <div className="bg-white p-[15px]  inline-block">
        <img
          src={siteBaseUrl + "deckcards/" + cardDetail.card_img}
          alt="card"
          className={`${imgWidthCss} h-[285px] m-auto object-cover`}
          onLoad={handleImageLoad}
        />
      </div>
      <div className="px-5 py-4">
        <div
          className="overflow-y-auto overscroll-contain mt-5 card-detail"
          style={{ maxHeight: "calc(100vh - 485px)" }}
        >
          <p
            className="text-[16px] text-[#302853]  pt-3 text-left whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: cardDetail.description }}
          />
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
