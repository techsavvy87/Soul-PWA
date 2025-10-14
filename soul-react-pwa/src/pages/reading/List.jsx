import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import { get } from "../../utils/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { siteBaseUrl } from "../../utils/constants";
import {
  setActiveReadingId,
  setIsLoading,
  setExtraReadings,
  setElementEmpty,
} from "../../redux/appsettingSlice";
import { useNavigate } from "react-router-dom";

const ReadingList = () => {
  const [readingList, setReadingList] = useState([]);
  const [readingId, setReadingId] = useState(null);
  const renderStatus = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const prevPageName = useSelector((state) => state.appsetting.prevPageName);
  const storedReadings = useSelector((state) => state.appsetting.readings);
  const { isLoading } = useSelector((state) => state.appsetting);

  const lastReadingId = Number(window.localStorage.getItem("lastReadingId"));
  let initialSlideIndex =
    readingList?.findIndex((r) => r.id === lastReadingId) ?? 0;

  useEffect(() => {
    // Fetch reading list data
    const fetchReadingList = async () => {
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const response = await get("/reading/all");
        setReadingList(response.data.data);
        dispatch(setExtraReadings({ readings: response.data.data }));

        // When there is at least one reading, display icon like send, favorite, flip
        if (response.data.data.length == 0) {
          // Handle empty reading list case
          dispatch(setElementEmpty({ elementEmpty: true }));
        } else {
          dispatch(setElementEmpty({ elementEmpty: false }));
        }
      } catch (error) {
        console.error("Error fetching reading list:", error);
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };

    if (!renderStatus.current) {
      renderStatus.current = true;

      if (prevPageName === "burger") {
        initialSlideIndex = 1; // Always start from the second slide when coming from burger menu
        fetchReadingList();
      } else {
        if (storedReadings && storedReadings.length > 0) {
          setReadingList(storedReadings);
        } else {
          initialSlideIndex = 1; // Always start from the second slide when coming from burger menu
          fetchReadingList();
        }
      }
    }
  }, []);

  // Don't render until API finishes
  if (isLoading) {
    return null; // or return <Spinner /> if you want a loader
  }
  return (
    <div className="cardswiper">
      {readingList.length === 0 ? (
        <p className="font-poppins text-center text-[#3F356E] text-2xl pt-[50%] px-[10px]">
          There is no reading to display.
        </p>
      ) : readingList.length === 1 ? (
        <div className="max-w-[80%] m-auto bg-white">
          <img
            src={siteBaseUrl + "reading/" + readingList[0].img}
            alt={`slide-0`}
            className="w-full m-auto"
            onClick={() => {
              window.localStorage.setItem(
                "reading",
                JSON.stringify(readingList[0])
              );
              dispatch(setActiveReadingId({ readingId: readingList[0].id }));
              window.localStorage.setItem("readingId", readingList[0].id);
              window.localStorage.setItem("lastReadingId", readingList[0].id);
              navigate("/reading/fullscreen");
            }}
          />
        </div>
      ) : (
        <Swiper
          className="absolute left-1/2"
          modules={[Pagination, Autoplay]}
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          spaceBetween={0}
          slidesPerView="auto"
          centeredSlides={true}
          loop={true}
          initialSlide={initialSlideIndex}
          style={{ padding: "0 60px" }}
          onSwiper={(swiper) => {
            // Run once on mount to save the initial card
            const realIndex = swiper.realIndex;
            const currentReading = readingList?.[realIndex];
            if (currentReading) {
              dispatch(setActiveReadingId({ readingId: currentReading.id }));
              window.localStorage.setItem("readingId", currentReading.id);
              window.localStorage.setItem("lastReadingId", currentReading.id);
            }
          }}
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
            window.localStorage.setItem("readingId", currentReading.id);
            // Save to localStorage so it persists across pages
            window.localStorage.setItem("lastReadingId", currentReading.id);
          }}
        >
          {readingList.map((reading, index) => (
            <SwiperSlide key={index} style={{ width: "100%" }}>
              <img
                src={siteBaseUrl + "reading/" + reading.img}
                alt={`slide-${index}`}
                className="w-full m-auto object-cover"
                onClick={() => {
                  window.localStorage.setItem(
                    "reading",
                    JSON.stringify(reading)
                  );
                  navigate("/reading/fullscreen");
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default ReadingList;
