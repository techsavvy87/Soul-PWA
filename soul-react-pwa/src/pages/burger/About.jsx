import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-simple-toasts";
import { setIsLoading } from "../../redux/appsettingSlice";
import { get } from "../../utils/axios";
import ToastLayout from "../../components/ToastLayout";
import SubHeader from "../../components/SubHeader";

const About = () => {
  const [about, setAbout] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    getAboutData();
  }, []);

  const getAboutData = async () => {
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const result = await get("/about");
      const resResult = result.data;
      dispatch(setIsLoading({ isLoading: false }));
      if (resResult.status) {
        setAbout(resResult.result);
      }
    } catch (err) {
      dispatch(setIsLoading({ isLoading: false }));
      toast(<ToastLayout message="Something went wrong." type="fail-toast" />, {
        className: "fail-toast",
      });
      return;
    }
  };

  return (
    <div>
      {about && (
        <div className="mt-2.5">
          <SubHeader pageName="" textColor="white" />
          <div className="flex justify-between items-end mb-2.5">
            <p className="font-poppins font-semibold text-yellow-400 text-2xl  pb-2">
              {about.title}
            </p>
            {about.cover_img_url && (
              <img
                src={about.cover_img_url}
                alt="Cover"
                className="w-28 h-28 object-cover rounded-lg ml-2"
              />
            )}
          </div>
          <div
            className="overflow-y-auto overscroll-contain hide-scrollbar"
            style={{ maxHeight: "calc(100vh - 266px)" }}
          >
            <p className="pr-1 text-white text-[16px] leading-relaxed font-poppins whitespace-pre-wrap">
              {about.description}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default About;
