import { Fragment } from "react";
import StarImg from "../../assets/imgs/star.png";
import { useNavigate } from "react-router-dom";

const WelcomeReset = () => {
  const navigate = useNavigate();
  const onClickOKBtn = () => {
    navigate("/");
  };
  return (
    <Fragment>
      <div className="w-full mx-4">
        <img src={StarImg} alt="Logo" className="mx-auto w-21" />
        <p className="mt-5 mb-2 text-center font-poppins text-2xl font-semibold text-[#3F356E]">
          Great News
        </p>
        <p className="text-center font-poppins text-[14px] font-light text-[#433971]">
          Your password has been successfully reset
        </p>
        <button
          type="button"
          className="tracking-wide font-poppins font-semibold text-white uppercase mt-8 bg-[#3F356E] rounded-[38px] text-md w-full px-5 py-4 text-center"
          onClick={onClickOKBtn}
        >
          ok
        </button>
      </div>
    </Fragment>
  );
};

export default WelcomeReset;
