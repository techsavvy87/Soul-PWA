import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-simple-toasts";
import ReactPlayer from "react-player";
import { setIsLoading } from "../../redux/appsettingSlice";
import { get } from "../../utils/axios";
import LoadingModal from "../../components/LoadingModal";
import JournalTop from "../../components/JournalTop";

const MeditationVideo = () => {
  const isLoading = useSelector((state) => state.appsetting.isLoading);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [meditation, setMeditation] = useState(null);

  useEffect(() => {
    getMeditationDetail();
  }, [id]);

  const getMeditationDetail = async () => {
    const url = `/meditation/detail/${id}`;
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const result = await get(url);
      const resResult = result.data;
      if (resResult.status) {
        setMeditation(resResult.result);
      }
    } catch (err) {
      console.log("Error: ", err);
    } finally {
      dispatch(setIsLoading({ isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen meditation-media px-5 py-10 flex justify-center items-center">
      <div>
        {meditation && (
          <ReactPlayer
            url={`https://vimeo.com/${meditation.vimeo_id}`}
            controls
            height="100%"
          />
        )}
      </div>
      <LoadingModal open={isLoading} />
    </div>
  );
};

export default MeditationVideo;
