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

  return (
    <div className="text-center">
      <div className="bg-white p-[15px] relative inline-block mb-[10%]">
        <img
          src={siteBaseUrl + "reading/" + readingDetail.img}
          alt="card"
          className="w-[190px] h-[285px] object-f m-auto object-cover"
        />
        <p className="font-poppins font-bold text-black inline-block  absolute bottom-[4%] left-1/2 -translate-x-1/2 py-[2px] px-3 text-[14px] bg-white text-center">
          {readingDetail.title}
        </p>
        <p className="font-bold text-black text-[20px] absolute bottom-[3%] w-11 h-11 bg-white rounded-full flex items-center justify-center">
          {readingDetail.number}
        </p>
      </div>
      <p className="font-poppins text-[14px] font-light text-[#302853] leading-[160%] break-words text-left">
        {readingDetail.description}
      </p>
    </div>
  );
};

export default ReadingDetail;
