import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-simple-toasts";
import { setIsLoading } from "../../redux/appsettingSlice";
import { get } from "../../utils/axios";
import ToastLayout from "../../components/ToastLayout";
import JournalTop from "../../components/JournalTop";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LoadingModal from "../../components/LoadingModal";
import { useNavigate } from "react-router-dom";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";

const MeditationList = () => {
  const [meditations, setMeditations] = useState([]);
  const renderStatus = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.appsetting);

  useEffect(() => {
    if (!renderStatus.current) {
      getMeditations();
      renderStatus.current = true;
    }
  }, []);

  const getMeditations = async () => {
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const result = await get("/meditation/all");
      const resResult = result.data;
      if (resResult.status) {
        setMeditations(resResult.result);
      }
    } catch (err) {
      toast(<ToastLayout message="Something went wrong." type="fail-toast" />, {
        className: "fail-toast",
      });
      return;
    } finally {
      dispatch(setIsLoading({ isLoading: false }));
    }
  };

  // Don't render until API finishes
  if (isLoading) {
    return <LoadingModal open={isLoading} />; // or return <Spinner /> if you want a loader
  }

  return (
    <div className="min-h-screen meditation-list px-5 pt-8 pb-5">
      <JournalTop />
      <p className="font-poppins font-semibold text-2xl text-center text-[#3F356E] pt-3 pb-2.5">
        Guided Meditations
      </p>
      <div
        className="overflow-y-auto overscroll-contain card-detail"
        style={{ maxHeight: "calc(100vh - 154px)" }}
      >
        {meditations.length === 0 ? (
          <p className="font-poppins text-center text-2xl pt-10">
            There are no meditations available.
          </p>
        ) : (
          meditations.map((meditation) => (
            <div
              key={meditation.id}
              className="rounded-[12px]  px-[9px] py-2.5 space-y-3 mb-2.5 bg-gradient-to-b from-[#9AA2FE] to-[#5E4DF9] text-white"
              onClick={() => navigate(`/meditation/detail/${meditation.id}`)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <AccessTimeIcon
                    sx={{ fontSize: "20px", marginRight: "5px" }}
                  />
                  <span className="font-poppins font-medium text-[14px]">
                    {meditation.duration}
                  </span>
                </div>
                <div>
                  <span className="font-poppins font-medium text-[14px]">
                    {meditation.type === "Text" ? (
                      <AutoStoriesIcon className="text-white text-xl mr-1.5" />
                    ) : meditation.type === "Audio" ? (
                      <VolumeUpIcon className="text-white text-xl mr-1.5" />
                    ) : (
                      <VideoCameraFrontIcon
                        className="text-white text-xl mr-1.5"
                        style={{ fontSize: 19 }}
                      />
                    )}
                    {new Date(meditation.published_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
              </div>
              <p className="font-poppins font-semibold text-[16px] mb-0">
                {meditation.title}
              </p>
              <p className="font-poppins font-light text-[14px] line-clamp-2 text-ellipsis">
                {meditation.description}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MeditationList;
