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
  const sacCardDeckNameCss =
    "bg-gray-500 opacity-70 px-[15px] py-[5px] rounded-[10px]";

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

  return (
    <div className="client-detail text-center pt-8 pb-4 px-4">
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

                <p
                  className={`text-white absolute bottom-7 left-1/2 -translate-x-1/2 text-center whitespace-nowrap text-[12px]
                            ${
                              cardDetail.category_name
                                .toLowerCase()
                                .includes("sacred")
                                ? sacCardDeckNameCss
                                : ""
                            }
                          `}
                >
                  {cardDetail.category_name}
                </p>
              </>
            )}
          </>
        )}
      </div>
      <div className="pt-4">
        <div
          className="overflow-y-auto overscroll-contain card-detail"
          style={{ maxHeight: "calc(100vh - 355px)" }}
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
