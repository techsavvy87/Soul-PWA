import AppHeader from "../../components/AppHeader";
import { useNavigate } from "react-router-dom";
import checkImg from "../../assets/imgs/check.png";
import SubHeader from "../../components/SubHeader";

const JournalWelcome = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen layout-journal px-5 py-8">
      <AppHeader />
      <SubHeader
        pageName=""
        textColor="#433971"
        pageCss={{ paddingTop: "60px" }}
      />
      <img src={checkImg} alt="Logo" className="mx-auto w-21 mt-[20%]" />
      <p className="mt-5 mb-2 text-center font-poppins text-2xl font-semibold text-[#3F356E]">
        Journal Entry Deleted
      </p>
      <p className="text-center font-poppins text-[14px] font-light text-[#433971] mb-13">
        You have successfully deleted your journal entry.
      </p>
      <button
        type="submit"
        className="w-full text-white font-poppins font-semibold text-[16px] py-4 rounded-[38px] bg-[#3F356E]"
        onClick={() => navigate("/journal")}
      >
        OK
      </button>
    </div>
  );
};
export default JournalWelcome;
