import { useDispatch } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { get } from "../../utils/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { siteBaseUrl } from "../../utils/constants";
import { setActiveReadingId, setIsLoading } from "../../redux/appsettingSlice";
import { useNavigate } from "react-router-dom";

const ReadingList = () => {
  const [readingList, setReadingList] = useState([]);
  const [readingId, setReadingId] = useState(null);
  const renderStatus = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch reading list data
    const fetchReadingList = async () => {
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const response = await get("/reading/all");
        setReadingList(response.data.data);
      } catch (error) {
        console.error("Error fetching reading list:", error);
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };

    if (!renderStatus.current) {
      renderStatus.current = true;
      fetchReadingList();
    }
  }, []);

  return (
    <div className="h-[calc(100vh-80px)] flex items-center justify-center">
      <Swiper
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 300000 }}
        spaceBetween={0}
        slidesPerView="auto"
        centeredSlides={true}
        loop={true}
        initialSlide={1}
        style={{ padding: "0 60px" }}
        onRealIndexChange={(swiper) => {
          // Get the real index in loop mode
          const realIndex = swiper.realIndex;
          const currentReading = readingList?.[realIndex];
          if (!currentReading) {
            console.warn("Reading not found for index:", realIndex);
            return;
          }

          setReadingId(currentReading.id);
          dispatch(setActiveReadingId({ readingId: currentReading.id }));
          window.sessionStorage.setItem("readingId", currentReading.id);
        }}
      >
        {readingList.map((reading, index) => (
          <SwiperSlide key={index} style={{ width: "100%" }}>
            <img
              src={siteBaseUrl + "reading/" + reading.img}
              alt={`slide-${index}`}
              className="w-full m-auto rounded-[15px] object-cover"
              onClick={() => {
                window.sessionStorage.setItem(
                  "reading",
                  JSON.stringify(reading)
                );
                navigate("/reading/fullscreen");
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ReadingList;
