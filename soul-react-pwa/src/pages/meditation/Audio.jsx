import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { get } from "../../utils/axios";
import LoadingModal from "../../components/LoadingModal";
import { setIsLoading } from "../../redux/appsettingSlice";
import toast from "react-simple-toasts";
import ToastLayout from "../../components/ToastLayout";
import JournalTop from "../../components/JournalTop";
import AudioBackward from "../../assets/imgs/audio_backward_icon.png";
import AudioForward from "../../assets/imgs/audio_forward_icon.png";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import { formatTime } from "../../utils/constants";

const MeditationAudio = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const audioRef = useRef(null);
  const renderStatus = useRef(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [meditation, setMeditation] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const isLoading = useSelector((state) => state.appsetting.isLoading);

  useEffect(() => {
    if (!renderStatus.current) {
      getMeditationDetail();
      renderStatus.current = true;
    }
  }, [id]);

  const getMeditationDetail = async () => {
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const response = await get(`/meditation/detail/${id}`);
      const resResult = response.data;
      if (resResult.status) {
        setMeditation(resResult.result);
      }
    } catch (error) {
      console.error("Error fetching meditation:", error);
      toast(<ToastLayout message="Something went wrong." type="fail-toast" />, {
        className: "fail-toast",
      });
    } finally {
      dispatch(setIsLoading({ isLoading: false }));
    }
  };

  const onPlayPauseClick = () => {
    if (isPlaying) {
      setIsPlaying(false);
      audioRef.current?.pause();
    } else {
      setIsPlaying(true);
      audioRef.current?.play();
    }
  };

  const onLoadedMetadata = () => {
    console.log("DDD==", audioRef.current.duration);
    setDuration(audioRef.current.duration);
  };

  const onTimeUpdate = (e) => {
    setCurrentTime(audioRef.current.currentTime);
    if (e.target.currentTime === duration) setIsPlaying(false);
  };

  const onRangeChange = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const onForwardBackward = (val) => {
    console.log("val: ", val);
    console.log("pre current==", currentTime);
    let newCurrentTime;

    if (val === "forward") {
      newCurrentTime = currentTime + 15;
    } else {
      newCurrentTime = currentTime > 15 ? currentTime - 15 : 0;
      console.log("backward==", newCurrentTime);
    }

    console.log("New Current Time: ", newCurrentTime);
    console.log("Audio Current Time===", audioRef.current.currentTime);

    audioRef.current.currentTime = newCurrentTime;
    setCurrentTime(newCurrentTime);
  };

  return (
    <div className="min-h-screen meditation-media px-5 py-10">
      <JournalTop />
      <div className="text-center pt-[45%]">
        <p className="font-poppins font-semibold text-[#3f356e] text-3xl w-19/20">
          {meditation?.title}
        </p>
        <p className="font-poppins font-light text-[14px] text-[#695AAF] uppercase mt-5">
          {new Date(meditation?.published_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </p>
        <div className="flex justify-between items-center mt-20 w-7/8 mx-auto">
          <img
            src={AudioBackward}
            className="w-8 h-auto"
            alt="audio backward"
            onClick={() => onForwardBackward("backward")}
          />
          {isPlaying ? (
            <PauseCircleIcon
              className="rounded-full text-[#3f356e] flex items-center justify-center"
              style={{ fontSize: 110 }}
              onClick={onPlayPauseClick}
            />
          ) : (
            <PlayCircleIcon
              className="rounded-full text-[#3f356e] flex items-center justify-center"
              style={{ fontSize: 110 }}
              onClick={onPlayPauseClick}
            />
          )}
          <img
            src={AudioForward}
            className="w-8 h-auto"
            alt="audio forward"
            onClick={() => onForwardBackward("forward")}
          />
        </div>
        <audio
          src={meditation?.media_src_url}
          ref={audioRef}
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          preload="auto"
        />
        <div className="w-19/20 mx-auto mt-10">
          <input
            className="w-full h-1 range-sm slider accent-transparent"
            type="range"
            min="0"
            max={duration}
            step="0.01"
            value={currentTime}
            onChange={onRangeChange}
          />
          <div className="flex justify-between items-center">
            <p className="text-[#3f356e] font-poppins text-[16px]">
              {formatTime(currentTime)}
            </p>
            <p className="text-[#3f356e] font-poppins text-[16px]">
              {formatTime(duration)}
            </p>
          </div>
        </div>
      </div>
      <LoadingModal open={isLoading} />
    </div>
  );
};

export default MeditationAudio;
