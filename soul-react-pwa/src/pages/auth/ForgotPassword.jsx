import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-simple-toasts";
import { post } from "../../utils/axios";
import { setIsLoading } from "../../redux/appsettingSlice";
import ToastLayout from "../../components/ToastLayout";
import LogoImg from "../../assets/imgs/logo.png";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const onClickSendBtn = async () => {
    if (!email) {
      toast(
        <ToastLayout message="Please enter your email" type="fail-toast" />,
        {
          className: "fail-toast",
        }
      );
      return;
    } else {
      const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      if (mailformat.test(email.trim()) === false) {
        toast(
          <ToastLayout
            message="Please enter a valid email"
            type="fail-toast"
          />,
          {
            className: "fail-toast",
          }
        );
        return;
      }
    }

    const url = "/forgot/password";
    const data = {
      email,
    };
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const result = await post(url, data);
      const resResult = result.data;
      dispatch(setIsLoading({ isLoading: false }));
      if (resResult.status) {
        navigate("/reset-password", {
          state: { id: resResult.result },
        });
      } else {
        toast(<ToastLayout message={resResult.message} type="fail-toast" />, {
          className: "fail-toast",
        });
      }
    } catch (err) {
      console.log("Error: ", err);
      dispatch(setIsLoading({ isLoading: false }));

      toast(<ToastLayout message="Something went wrong." type="fail-toast" />, {
        className: "fail-toast",
      });
    }
  };

  return (
    <div className="w-full mx-4">
      <img src={LogoImg} alt="Logo" className="mx-auto w-43" />
      <p className="mt-10 mb-3 text-center font-poppins text-2xl font-semibold text-[#3F356E]">
        Reset Password
      </p>
      <p className="text-center font-poppins text-[13px] font-light text-[#433971]">
        Please enter your email and we’ll send you a verification code
      </p>
      <form className="mt-4">
        <input
          type="email"
          className="my-8 bg-[#FDFDFB] border-none bg-primary-color border border-gray-300 text-gray-900 text-base rounded-md focus:outline-none focus:ring-0 block w-full p-2.5 "
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <p className="text-center font-poppins text-[13px] font-light text-[#433971]">
          Have an account?{" "}
          <Link
            to="/login"
            className="text-center font-poppins text-[13px] text-[#433971] underline font-medium"
          >
            Log in here
          </Link>
        </p>
        <button
          type="button"
          className="font-poppins font-semibold tracking-wide text-white uppercase mt-8 bg-[#3F356E]   rounded-[38px] text-md w-full px-5 py-4 text-center"
          onClick={onClickSendBtn}
        >
          Send
        </button>
      </form>
    </div>
  );
};
export default ForgotPassword;
