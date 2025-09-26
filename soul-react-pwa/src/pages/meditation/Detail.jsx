import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-simple-toasts";
import { setIsLoading } from "../../redux/appsettingSlice";
import { get } from "../../utils/axios";
import ToastLayout from "../../components/ToastLayout";
import JournalTop from "../../components/JournalTop";
import LoadingModal from "../../components/LoadingModal";
import { useParams, useNavigate } from "react-router-dom";
import PlayCircleFilledWhiteIcon from "@mui/icons-material/PlayCircleFilledWhite";
import ReactPlayer from "react-player";

const MeditationDetail = () => {
  const audioRef = useRef(null);
  const [meditation, setMeditation] = useState(null);
  const [duration, setDuration] = useState(0);
  const renderStatus = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isLoading } = useSelector((state) => state.appsetting);
  useEffect(() => {
    if (!renderStatus.current) {
      getMeditationDetail();
      renderStatus.current = true;
    }
  }, []);

  const getMeditationDetail = async () => {
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const result = await get(`/meditation/detail/${id}`);
      const resResult = result.data;
      console.log("meditation detail:", resResult.result);
      if (resResult.status) {
        setMeditation(resResult.result);
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

  const onPlayClick = () => {
    if (meditation.type === "Audio") {
      navigate(`/meditation/audio/${meditation.id}`);
    } else if (meditation.type === "Video") {
      navigate(`/meditation/video/${meditation.id}`);
    }
  };

  return (
    <div className="min-h-screen meditation-list px-5 pt-8 pb-5">
      <JournalTop />
      <p className="font-poppins font-semibold text-2xl text-center text-[#3F356E] pt-3 pb-2.5">
        Meditation Detail
      </p>
      <div>
        <img
          src={meditation?.cover_img_url}
          className="w-full h-48 object-cover rounded-tl-2xl rounded-tr-2xl"
        />
        <div className="bg-gradient-to-b from-[#9AA2FE] to-[#5E4DF9] rounded-bl-2xl rounded-br-2xl px-5 py-4">
          {meditation?.type !== "Text" && (
            <div className="flex gap-3 items-center pt-2 pb-4 border-b-1 border-white">
              <PlayCircleFilledWhiteIcon
                className="text-white"
                style={{ fontSize: "2rem", color: "white" }}
                onClick={onPlayClick}
              />
              <div>
                <p className="text-white font-poppins text-[16px]">
                  Tap to Listen
                </p>
                <p className="text-white font-poppins pt-0.5 text-[16px]">
                  {meditation?.duration}
                </p>
              </div>
            </div>
          )}
          {meditation?.type === "Audio" && (
            <audio
              src={meditation?.media_src_url}
              ref={audioRef}
              onLoadedMetadata={() => setDuration(audioRef.current.duration)}
            />
          )}
          {meditation?.type === "Video" && (
            <div className="hidden">
              <ReactPlayer
                url={`https://vimeo.com/${meditation?.vimeo_id}`}
                controls
                onDuration={(duration) => setDuration(duration)}
              />
            </div>
          )}
          <div
            className="overflow-y-auto overscroll-contain mt-5 hide-scrollbar"
            style={{
              maxHeight:
                meditation?.type === "Text"
                  ? "calc(100vh - 428px)"
                  : "calc(100vh - 475px)",
            }}
          >
            <p className="text-[#ebd371] text-[16px] font-poppins font-semibold">
              {new Date(meditation?.published_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-white font-poppins pt-3 text-xl">
              {meditation?.title}
            </p>
            <p
              className="text-gray-100 font-poppins pt-3 text-[17px]"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {meditation?.description}
            </p>
          </div>
        </div>
      </div>
      <LoadingModal open={isLoading} />
    </div>
  );
};

export default MeditationDetail;
