import { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { siteBaseUrl } from "../../utils/constants";
import { getWithParams } from "../../utils/axios";
import { setIsLoading } from "../../redux/appsettingSlice";
import { useDispatch } from "react-redux";

const ReadingDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const renderStatus = useRef(false);
  const { id } = useParams();
  const [readingDetail, setReadingDetail] = useState([]);
  const [imgWidthCss, setImgWidthCss] = useState("w-[190px]");

  useEffect(() => {
    const fetchReadingDetail = async () => {
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const result = await getWithParams(`/reading/detail/${id}`);
        setReadingDetail(result.data.data);
      } catch (error) {
        console.error("Error fetching reading detail:", error);
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };

    if (!renderStatus.current) {
      fetchReadingDetail();
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
          src={siteBaseUrl + "reading/" + readingDetail.img}
          alt="card"
          className={`${imgWidthCss} h-[285px] m-auto object-cover`}
          onLoad={handleImageLoad}
        />
      </div>
      <div className="py-4">
        <div
          className="overflow-y-auto overscroll-contain hide-scrollbar"
          style={{ maxHeight: "calc(100vh - 535px)" }}
        >
          <p
            className="font-poppins text-[18px] text-[#302853]  text-left whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: readingDetail.description }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReadingDetail;
