import { useState, Fragment } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-simple-toasts";
import { post } from "../../utils/axios";
import { setIsLoading } from "../../redux/appsettingSlice";
import CodeInput from "../../components/CodeInput";
import PasswordInput from "../../components/PasswordInput";
import ToastLayout from "../../components/ToastLayout";
import LogoImg from "../../assets/imgs/logo.png";
import { login } from "../../redux/authSlice";

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = location.state || "";
  const dispatch = useDispatch();

  const [code, setCode] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [view, setView] = useState("VerifyCodeUI");

  const onSubmitCode = (codeTxt) => {
    setCode(codeTxt);
  };

  const onClickVerifyCodeBtn = async () => {
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

    const url = "/verify/code";
    const data = {
      userId: id,
      code,
    };
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const result = await post(url, data);
      const resResult = result.data;
      dispatch(setIsLoading({ isLoading: false }));
      if (resResult.status) {
        setView("NewPwdUI");
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

  const onClickResetPWDBtn = async () => {
    if (!pwd) {
      toast(
        <ToastLayout
          message="Please enter your new password"
          type="fail-toast"
        />,
        {
          className: "fail-toast",
        }
      );
      return;
    } else {
      if (pwd !== confirmPwd) {
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

    const url = "/reset/password";
    const data = {
      userId: id,
      password: pwd,
    };
    dispatch(setIsLoading({ isLoading: true }));

    try {
      const result = await post(url, data);
      const resResult = result.data;
      console.log("Response==", resResult);
      dispatch(setIsLoading({ isLoading: false }));
      if (resResult.status) {
        dispatch(
          login({
            isAuthenticated: true,
            user: resResult.result.user,
            token: resResult.result.access_token,
          })
        );
        window.sessionStorage.setItem("isAuthenticated", "done");
        window.sessionStorage.setItem(
          "user",
          JSON.stringify(resResult.result.user)
        );
        window.sessionStorage.setItem("token", resResult.result.access_token);

        navigate("/welcome-reset");
      }
    } catch (error) {}
  };

  return (
    <Fragment>
      {view === "VerifyCodeUI" && (
        <div className="w-full mx-4">
          <img src={LogoImg} alt="Logo" className="mx-auto w-43" />
          <p className="mt-10 mb-3 text-center font-poppins text-2xl font-semibold text-[#3F356E]">
            Reset Password
          </p>
          <p className="text-center font-poppins text-[13px] font-light text-[#433971]">
            Please enter the 6-digit code from your email
          </p>

          <div className="my-8">
            <CodeInput callback={onSubmitCode} />
          </div>
          <p className="text-center font-poppins text-[13px] font-light text-[#433971]">
            Have an account?{" "}
            <Link
              to="/login"
              className="text-center font-poppins text-[13px] font-light text-[#433971] underline font-medium"
            >
              Log in here
            </Link>
          </p>
          <button
            type="button"
            className="font-poppins font-semibold tracking-wide text-white uppercase mt-8 bg-[#3F356E]   rounded-[38px] text-md w-full px-5 py-4 text-center"
            onClick={onClickVerifyCodeBtn}
          >
            OK
          </button>
        </div>
      )}
      {view === "NewPwdUI" && (
        <div className="w-full mx-4">
          <img src={LogoImg} alt="Logo" className="mx-auto w-43" />
          <p className="mt-10 mb-3 text-center font-poppins text-2xl font-semibold text-[#3F356E]">
            Enter Your New Password
          </p>
          <PasswordInput
            password={pwd}
            onChangePassword={(e) => setPwd(e.target.value)}
          />
          <PasswordInput
            password={confirmPwd}
            onChangePassword={(e) => setConfirmPwd(e.target.value)}
            placeholder="Confirm Password"
          />
          <button
            type="button"
            className="font-poppins font-semibold tracking-wide text-white uppercase mt-8 bg-[#3F356E]   rounded-[38px] text-md w-full px-5 py-4 text-center"
            onClick={onClickResetPWDBtn}
          >
            OK
          </button>
        </div>
      )}
    </Fragment>
  );
};

export default ResetPassword;
