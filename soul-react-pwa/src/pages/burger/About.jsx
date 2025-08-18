import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-simple-toasts";
import { setIsLoading } from "../../redux/appsettingSlice";
import { get } from "../../utils/axios";
import ToastLayout from "../../components/ToastLayout";

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
      <p className="font-poppins font-semibold text-white text-2xl text-center pt-5 pb-5">
        About
      </p>
      <div className="bg-cover bg-center relative">
        {about && (
          <div className="px-2">
            <div className="flex justify-between items-end mb-5">
              <h2 className="text-yellow-400 text-2xl font-poppins pb-2">
                {about.title}
              </h2>
              {about.cover_img_url && (
                <img
                  src={about.cover_img_url}
                  alt="Cover"
                  className="w-28 h-28 object-cover rounded-lg ml-2"
                />
              )}
            </div>

            <div
              className="pr-1 text-white text-lg leading-relaxed font-poppins mb-24"
              style={{ whiteSpace: "pre-wrap" }}
            >
              {about.description}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
