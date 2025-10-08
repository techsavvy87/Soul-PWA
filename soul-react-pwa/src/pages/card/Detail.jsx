import { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { siteBaseUrl } from "../../utils/constants";
import { getWithParams } from "../../utils/axios";
import { setIsLoading } from "../../redux/appsettingSlice";
import { useSelector, useDispatch } from "react-redux";

const CardDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const renderStatus = useRef(false);
  const { id } = useParams();
  const [cardDetail, setCardDetail] = useState({});
  const { isLoading } = useSelector((state) => state.appsetting);

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

  // Helper function to get background color class
  const getCategoryBg = (categoryName) => {
    const name = categoryName.toLowerCase();

    if (["alchemy", "sacred", "master"].some((w) => name.includes(w))) {
      return "bg-[#0076ba]";
    } else if (name.includes("transcend")) {
      return "bg-[#534eb4]";
    } else if (name.includes("release")) {
      return "bg-[#f17201]";
    } else {
      return "bg-[#333]";
    }
  };

  // Don't render until API finishes
  if (isLoading) {
    return null; // or return <Spinner /> if you want a loader
  }

  return (
    <div className="text-center mt-4 mx-4">
      <div className="inline-block relative">
        <img
          src={siteBaseUrl + "deckcards/" + cardDetail.card_img}
          alt="card"
          className="w-[190px] h-[285px] m-auto object-cover"
        />
        {cardDetail && cardDetail.category_name && (
          <>
            {!cardDetail.category_name
              .toLowerCase()
              .includes("personality") && (
              <>
                <p
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-[14px] font-bold px-[20px] py-[5px] rounded-[15px] whitespace-nowrap
                        ${getCategoryBg(cardDetail.category_name)}`}
                >
                  {cardDetail.title}
                </p>

                <p className="text-white w-full absolute bottom-7 left-1/2 -translate-x-1/2 text-center text-[12px]">
                  {cardDetail.category_name}
                </p>
              </>
            )}
          </>
        )}
      </div>
      <div className="py-4">
        <div
          className="overflow-y-auto overscroll-contain card-detail"
          style={{ maxHeight: "calc(100vh - 500px)" }}
        >
          <p
            className="text-[18px] text-[#302853] text-left whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: cardDetail.description }}
          />
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
