import { useState } from "react";
import CodeInput from "../../components/CodeInput";
import LogoImg from "../../assets/imgs/logo.png";
import toast from "react-simple-toasts";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import ToastLayout from "../../components/ToastLayout";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || "";
  const dispatch = useDispatch();

  const [code, setCode] = useState("");
  const onSubmitCode = (codeTxt) => {
    setCode(codeTxt);
  };

  const onClickVerifyBtn = () => {
    if (!code) {
      toast(
        <ToastLayout
          message="Please enter the verification code"
          type="fail-toast"
        />,
        {
          className: "fail-toast",
        }
      );
      return;
    }

    // Proceed with verification logic
    navigate("/welcome", {
      state: { id, code },
    });
  };
  return (
    <div className="w-full mx-4">
      <img src={LogoImg} alt="Logo" className="mx-auto w-43" />
      <p className="mt-10 mb-3 text-center font-poppins text-2xl font-semibold text-[#3F356E]">
        Verify Your Email
      </p>
      <p className="text-center font-poppins text-[14px] font-light text-[#433971]">
        Please enter the 6-digit code from your email
      </p>

      <div className="my-8">
        <CodeInput callback={onSubmitCode} />
      </div>
      <p className="text-center font-poppins text-[14px] font-light text-[#433971]">
        Have an account?{" "}
        <span className="text-center font-poppins text-[14px] text-[#433971] underline font-medium">
          Log in here
        </span>
      </p>
      <button
        type="button"
        className="font-poppins font-semibold tracking-wide text-white uppercase mt-8 bg-[#3F356E]   rounded-[38px] text-md w-full px-5 py-4 text-center"
        onClick={onClickVerifyBtn}
      >
        Send
      </button>
    </div>
  );
};
export default VerifyEmail;
