import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ToastLayout from "../../components/ToastLayout";
import toast from "react-simple-toasts";
import { useSelector, useDispatch } from "react-redux";
import { get, post } from "../../utils/axios";
import LoadingModal from "../../components/LoadingModal";
import { setIsLoading } from "../../redux/appsettingSlice";
import AppHeader from "../../components/AppHeader";
import SubHeader from "../../components/SubHeader";

const JournalEdit = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [journal, setJournal] = useState({ title: "", entry: "" });
  const { isLoading } = useSelector((state) => state.appsetting);
  const { id } = useParams();
  const rendered = useRef(false);

  useEffect(() => {
    if (!rendered.current) {
      // Fetch the journal data by ID and set it to state
      const fetchJournal = async () => {
        dispatch(setIsLoading({ isLoading: true }));
        try {
          const response = await get(`/journal/${id}`);
          setJournal(response.data.data);
        } catch (error) {
          console.log("Error:", error);
        } finally {
          dispatch(setIsLoading({ isLoading: false }));
        }
      };
      fetchJournal();
      rendered.current = true;
    }
  }, []);

  const handleUpdateJournal = async () => {
    if (!journal.title.trim()) {
      toast(
        <ToastLayout
          message="Please enter a title for your journal."
          type="fail-toast"
        />,
        {
          className: "fail-toast",
        }
      );
      return;
    }
    if (!journal.entry.trim()) {
      toast(
        <ToastLayout
          message="Please enter your journal entry."
          type="fail-toast"
        />,
        {
          className: "fail-toast",
        }
      );
      return;
    }
    // In case of successful validation, save the journal
    const url = `/journal/update/${id}`;
    const data = {
      journal,
    };
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const response = await post(url, data);
      const resResult = response.data;
      dispatch(setIsLoading({ isLoading: false }));
      if (resResult.status) {
        navigate("/journal", { state: { status: "updated" } });
      }
    } catch (error) {
      toast(
        <ToastLayout
          message="Failed to save journal entry."
          type="fail-toast"
        />,
        {
          className: "fail-toast",
        }
      );
    } finally {
      dispatch(setIsLoading({ isLoading: false }));
    }
  };

  const handleDeleteJournal = async () => {
    const url = `/journal/delete/${id}`;
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const response = await post(url);
      const resResult = response.data;
      if (resResult.status) {
        navigate("/journal/welcome");
      }
    } catch (error) {
      toast(
        <ToastLayout
          message="Failed to delete journal entry."
          type="fail-toast"
        />,
        {
          className: "fail-toast",
        }
      );
    } finally {
      dispatch(setIsLoading({ isLoading: false }));
    }
  };
  return (
    <div className="min-h-screen layout-journal px-5 py-8">
      <AppHeader />
      <SubHeader pageName="My Journal" textColor="#3F356E" />
      <form className="space-y-5">
        <div>
          <label className="font-poppins font-light text-[14px] text-[rgba(63,53,110,0.7)] block mb-[5px]">
            Title
          </label>
          <input
            type="text"
            className="w-full border border-[rgba(161,142,255,0.5)] rounded-[12px] p-2.5 focus:border-[#3F356E]
                      font-poppins font-normal text-[16px] text-[#3F356E] leading-[160%] bg-white"
            value={journal.title}
            onChange={(e) => setJournal({ ...journal, title: e.target.value })}
          />
        </div>
        <div>
          <label className="font-poppins font-light text-[14px] text-[rgba(63,53,110,0.7)] block mb-[5px]">
            Journal Entry
          </label>
          <textarea
            className="w-full border border-[rgba(161,142,255,0.5)] rounded-[12px] p-5 focus:border-[#3F356E]
                      font-poppins font-normal text-[16px] text-[#3F356E] leading-[160%] bg-white mb-[30px]"
            rows="6"
            placeholder="Write your journal here..."
            value={journal.entry}
            onChange={(e) => setJournal({ ...journal, entry: e.target.value })}
          ></textarea>
        </div>
        <button
          type="button"
          className="w-full text-white font-poppins font-semibold text-[16px] py-4 rounded-[38px] bg-[#3F356E]"
          onClick={handleUpdateJournal}
        >
          SAVE
        </button>
        <button
          type="button"
          className="w-full text-[#3F356E] font-poppins font-semibold text-[16px] py-4 rounded-[38px] border-[#3F356E] border-[1.8px]"
          onClick={handleDeleteJournal}
        >
          DELETE
        </button>
      </form>
      <LoadingModal open={isLoading} />
    </div>
  );
};

export default JournalEdit;
