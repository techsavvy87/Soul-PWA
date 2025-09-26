import { useState } from "react";
import LogoImg from "../../assets/imgs/logo.png";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/PasswordInput";
import toast from "react-simple-toasts";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../../redux/appsettingSlice";
import { post } from "../../utils/axios";
import ToastLayout from "../../components/ToastLayout";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const onClickSignupBtn = async () => {
    // Make sure all fields are filled out correctly to sign up.
    if (!name) {
      toast(
        <ToastLayout message="Please enter your name" type="fail-toast" />,
        {
          className: "fail-toast",
        }
      );

      return;
    }

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

    if (!pwd) {
      toast(
        <ToastLayout message="Please enter your password" type="fail-toast" />,
        {
          className: "fail-toast",
        }
      );
      return;
    } else {
      if (pwd != confirmPwd) {
        toast(
          <ToastLayout
            message="The passwords do not match"
            type="fail-toast"
          />,
          {
            className: "fail-toast",
          }
        );
        return;
      }
    }

    const url = "/signup";
    const data = { name, email, password: pwd };
    dispatch(setIsLoading({ isLoading: true }));

    try {
      const result = await post(url, data);
      const resResult = result.data;
      console.log("Result: ", resResult);
      dispatch(setIsLoading({ isLoading: false }));
      if (resResult.status) {
        toast(
          <ToastLayout message={`${resResult.message}`} type="success-toast" />,
          {
            className: "success-toast",
          }
        );
        console.log("Result:", resResult.message);
        navigate("/verify-email", {
          state: { id: resResult.result },
        });
      } else {
        toast(
          <ToastLayout message={`${resResult.message}`} type="fail-toast" />,
          {
            className: "fail-toast",
          }
        );
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
      <p className="my-10 text-center font-poppins text-2xl font-semibold text-[#3F356E]">
        Sign-up to Blended Soul
      </p>
      <form className="mt-4">
        <input
          type="text"
          className="bg-[#FDFDFB] border-none mt-4 bg-primary-color border border-gray-300 text-gray-900 text-base rounded-md focus:outline-none focus:ring-0 block w-full p-2.5 "
          placeholder="Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          className="bg-[#FDFDFB] border-none mt-4 bg-primary-color border border-gray-300 text-gray-900 text-base rounded-md focus:outline-none focus:ring-0 block w-full p-2.5 "
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          password={pwd}
          onChangePassword={(e) => setPwd(e.target.value)}
        />
        <PasswordInput
          password={confirmPwd}
          onChangePassword={(e) => setConfirmPwd(e.target.value)}
          placeholder="Confirm Password"
        />
        <p className="mt-4 text-center font-poppins text-[14px] font-light text-[#433971]">
          <Link
            to="/login"
            className="text-center font-poppins text-[14px] text-[#433971] underline font-medium"
          >
            Log in here
          </Link>
          if you're already registered?{" "}
        </p>
        <button
          type="button"
          className="tracking-wide font-poppins font-semibold text-white uppercase mt-8 bg-[#3F356E]   rounded-[38px] text-md w-full px-5 py-4 text-center"
          onClick={onClickSignupBtn}
        >
          sign-up
        </button>
      </form>
    </div>
  );
};
export default Signup;
