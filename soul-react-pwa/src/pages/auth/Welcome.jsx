import { useEffect, useState, Fragment, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import LoadingUI from "../../components/LoadingUI";
import { post } from "../../utils/axios";
import StarImg from "../../assets/imgs/star.png";
import toast from "react-simple-toasts";
import { login } from "../../redux/authSlice";
import ToastLayout from "../../components/ToastLayout";

const Welcome = () => {
  const location = useLocation();
  const { id } = location.state || {}; // Get the code from the location state
  const { code } = location.state || {}; // Get the code from the location state

  const [view, setView] = useState("loading");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({});

  // This variable ensure API is only called once.
  const hasSubmitted = useRef(false);

  useEffect(() => {
    if (!hasSubmitted.current) {
      hasSubmitted.current = true;
      submitVerifyCode();
    }
  }, []);

  const submitVerifyCode = async () => {
    const url = "/signup/verify";
    const data = {
      userId: id,
      code,
    };
    try {
      const result = await post(url, data);
      const resResult = result.data;
      console.log("Result: ", resResult);
      if (resResult.status) {
        setView("welcome");
        setUserInfo(resResult.result.user_data);

        toast(
          <ToastLayout
            message="Your account has been created."
            type="success-toast"
          />,
          {
            className: "success-toast",
          }
        );
      } else {
        toast(<ToastLayout message={resResult.message} type="fail-toast" />, {
          className: "fail-toast",
        });
        navigate("/signup");
      }
    } catch (err) {
      toast(<ToastLayout message="Something went wrong." type="fail-toast" />, {
        className: "fail-toast",
      });
      console.log("catch:", err);
      navigate("/signup");
    }
  };

  const onClickOKBtn = () => {
    dispatch(
      login({
        isAuthenticated: true,
        user: userInfo.user,
        token: userInfo.access_token,
        tier: userInfo.tier,
        subscription: userInfo.subscription,
      })
    );
    window.sessionStorage.setItem("isAuthenticated", "done");
    window.sessionStorage.setItem("user", JSON.stringify(userInfo.user));
    window.sessionStorage.setItem("token", userInfo.access_token);
    window.sessionStorage.setItem("tier", userInfo.tier);
    window.sessionStorage.setItem("subscription", userInfo.subscription);
    navigate("/");
  };

  return (
    <Fragment>
      {view === "loading" && (
        <LoadingUI
          title="Hold tight!"
          description="We're just creating your account. This may take a few seconds."
        />
      )}
      {view === "welcome" && (
        <div className="w-full mx-4">
          <img src={StarImg} alt="Logo" className="mx-auto w-21" />
          <p className="mt-5 mb-2 text-center font-poppins text-2xl font-semibold text-[#3F356E]">
            Great News
          </p>
          <p className="text-center font-poppins text-[14px] font-light text-[#433971]">
            Your account has been created
          </p>
          <button
            type="button"
            className="tracking-wide font-poppins font-semibold text-white uppercase mt-8 bg-[#3F356E] rounded-[38px] text-md w-full px-5 py-4 text-center"
            onClick={onClickOKBtn}
          >
            ok
          </button>
        </div>
      )}
    </Fragment>
  );
};
export default Welcome;
