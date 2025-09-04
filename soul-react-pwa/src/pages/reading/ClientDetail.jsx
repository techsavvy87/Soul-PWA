import { useState, useRef, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { siteBaseUrl } from "../../utils/constants";
import { setIsLoading } from "../../redux/appsettingSlice";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { baseURL } from "../../utils/constants";
import LoadingModal from "../../components/LoadingModal";

const ReadingClientDetail = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const renderStatus = useRef(false);
  const { id } = useParams();
  const [readingDetail, setReadingDetail] = useState([]);
  const { isLoading } = useSelector((state) => state.appsetting);

  useEffect(() => {
    const fetchReadingDetail = async () => {
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const result = await axios.get(
          `${baseURL}/reading/client-detail/${id}`
        );
        console.log("sss==", result.data);
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
    <div className="min-h-screen layout-card px-5 py-10 flex flex-col justify-center">
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
      <LoadingModal open={isLoading} />
    </div>
  );
};

export default ReadingClientDetail;
