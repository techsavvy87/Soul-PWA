import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import LogoImg from "../../assets/imgs/logo.png";
import ToastLayout from "../../components/ToastLayout";
import toast from "react-simple-toasts";
import { useDispatch } from "react-redux";
import { setIsLoading } from "../../redux/appsettingSlice";
import { login } from "../../redux/authSlice";
import { post } from "../../utils/axios";
import PasswordInput from "../../components/PasswordInput";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onClickLoginBtn = async () => {
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
    if (!password) {
      toast(
        <ToastLayout message="Please enter your password" type="fail-toast" />,
        {
          className: "fail-toast",
        }
      );
      return;
    }

    const url = "/login";
    const data = {
      email,
      password,
    };
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const result = await post(url, data);
      const resResult = result.data;
      dispatch(setIsLoading({ isLoading: false }));
      if (resResult.status) {
        dispatch(
          login({
            isAuthenticated: true,
            user: resResult.result.user,
            token: resResult.result.access_token,
            tier: resResult.result.tier,
            subscription: resResult.result.subscription,
          })
        );
        window.sessionStorage.setItem("isAuthenticated", "done");
        window.sessionStorage.setItem(
          "user",
          JSON.stringify(resResult.result.user)
        );
        window.sessionStorage.setItem("token", resResult.result.access_token);
        window.sessionStorage.setItem("tier", resResult.result.tier);
        window.sessionStorage.setItem(
          "subscription",
          resResult.result.subscription
        );
        navigate(from, { replace: true });
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
      <p className="my-10 text-center font-poppins text-2xl font-semibold text-[#3F356E]">
        Log In to Blended Soul
      </p>
      <form className="mt-4">
        <input
          type="email"
          className="bg-[#FDFDFB] border-none mt-4 bg-primary-color border border-gray-300 text-gray-900 text-base rounded-md focus:outline-none focus:ring-0 block w-full p-2.5 "
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <PasswordInput
          password={password}
          onChangePassword={(e) => setPassword(e.target.value)}
        />

        <p className="text-center font-poppins text-[13px] font-light text-[#433971] mt-5">
          Forgot Password?
          <span className="text-center font-poppins text-[13px] text-[#433971] underline font-medium">
            <Link className="text-golden-color ml-2" to="/forgot-password">
              Reset Here
            </Link>
          </span>
        </p>
        <button
          type="button"
          className="tracking-wide font-poppins font-semibold text-white uppercase mt-5 bg-[#3F356E]   rounded-[38px] text-md w-full px-5 py-4 text-center"
          onClick={onClickLoginBtn}
        >
          Log In
        </button>
        <p className="mt-5 text-center font-poppins text-[13px] font-light text-[#433971]">
          Don't have an account?{" "}
        </p>
        <p className="text-center font-poppins text-[13px]  text-[#433971] underline font-medium">
          <Link to="/signup">Sign up Here</Link>
        </p>
      </form>
    </div>
  );
};
export default Login;
