import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-simple-toasts";
import { setIsLoading } from "../../redux/appsettingSlice";
import Logo from "../../assets/imgs/logo.png";
import { get } from "../../utils/axios";
import ToastLayout from "../../components/ToastLayout";
import SubHeader from "../../components/SubHeader";

const CreativeLab = () => {
  const [description, setDescription] = useState("");

  const dispatch = useDispatch();

  useEffect(() => {
    getDescription();
  }, []);

  const getDescription = async () => {
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const result = await get("/creative");
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
      <SubHeader pageName="Creative Lab" textColor="white" />
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
          className="overflow-y-auto overscroll-contain hide-scrollbar mt-3 pr-1"
          style={{ maxHeight: "calc(100vh - 298px)" }}
        >
          <p
            className="text-white text-lg leading-relaxed font-ovo"
            style={{ whiteSpace: "pre-wrap" }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreativeLab;
