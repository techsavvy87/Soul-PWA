import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-simple-toasts";
import { setIsLoading } from "../../redux/appsettingSlice";
import Logo from "../../assets/imgs/logo.png";
import { get } from "../../utils/axios";
import ToastLayout from "../../components/ToastLayout";
import SubHeader from "../../components/SubHeader";

const Concept = () => {
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    getDescription();
  }, []);

  const getDescription = async () => {
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const result = await get("/concept");
      const resResult = result.data;
      dispatch(setIsLoading({ isLoading: false }));
      if (resResult.status) {
        setDescription(resResult.result);
      }
    } catch (err) {
      dispatch(setIsLoading({ isLoading: false }));
      console.log(err);

      toast(<ToastLayout message="Something went wrong." type="fail-toast" />, {
        className: "fail-toast",
      });
      return;
    }
  };

  return (
    <div>
      <SubHeader
        pageName="What is Blended Soul?"
        textColor="white"
        pageCss={{ paddingLeft: "40px" }}
      />
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center">
          <div
            className="bg-white rounded-full p-3 border-4"
            style={{ borderColor: "#FFD700" }}
          >
            <img src={Logo} alt="Logo" className="w-22 h-22 object-contain" />
          </div>
        </div>

        <div
          className="mt-4 pr-1 overflow-y-auto overscroll-contain hide-scrollbar"
          style={{ maxHeight: "calc(100vh - 300px)" }}
        >
          <p className="text-white text-[16px] leading-relaxed font-poppins whitespace-pre-wrap">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Concept;
