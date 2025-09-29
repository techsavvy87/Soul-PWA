import { useState, useEffect, useRef } from "react";
import JournalTop from "../../components/JournalTop";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-simple-toasts";
import ToastLayout from "../../components/ToastLayout";
import { useSelector, useDispatch } from "react-redux";
import LoadingModal from "../../components/LoadingModal";
import { setIsLoading } from "../../redux/appsettingSlice";
import { getWithParams } from "../../utils/axios";

const JournalHome = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const rendered = useRef(false);
  const { status } = location.state || {};
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user.id);
  const { isLoading } = useSelector((state) => state.appsetting);
  const [journals, setJournals] = useState([]);

  useEffect(() => {
    const getJournals = async () => {
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const response = await getWithParams("/journal/all", { userId });
        setJournals(response.data.data);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };

    if (!rendered.current) {
      if (status === "created") {
        toast(
          <ToastLayout
            message="New journal created successfully!"
            type="success-toast"
          />,
          { className: "success-toast" }
        );
      }
      if (status === "updated") {
        toast(
          <ToastLayout
            message="Journal updated successfully!"
            type="success-toast"
          />,
          { className: "success-toast" }
        );
      }
      navigate(location.pathname, { replace: true });
      rendered.current = true; // prevent toast from showing multiple times
      getJournals();
    }
  }, []);
  return (
    <div className="min-h-screen journal-home px-5 py-8">
      <JournalTop />
      <p className="font-poppins font-semibold text-[#3F356E] text-2xl text-center pb-5">
        My Journal
      </p>
      <button
        className="w-full text-[#3F356E] font-poppins font-semibold text-[17px] py-2.5 rounded-[12px] 
                        border border-[rgba(161,142,255,0.5)] border-dashed bg-[rgba(161,142,255,0.5)]"
        onClick={() => navigate("/journal/new")}
      >
        + Add a new Journal entry
      </button>
      <div
        className="overflow-y-auto overscroll-contain hide-scrollbar"
        style={{ maxHeight: "calc(100vh - 210px)" }}
      >
        {journals.length === 0 ? (
          <p className="font-poppins text-center text-2xl pt-[50%]">
            There is no journal to display.
          </p>
        ) : (
          journals.map((journal) => (
            <div
              key={journal.id}
              className="w-full bg-white rounded-[12px] py-2.5 px-[9px] mt-2.5 space-y-3 border border-[rgba(161,142,255,0.5)]"
              onClick={() => navigate(`/journal/edit/${journal.id}`)}
            >
              <p className="font-poppins text-[14px] text-[rgba(63,53,110,0.7)] font-light mb-[5px]">
                {new Date(journal.published_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="font-poppins text-[18px] text-[#3F356E] font-semibold mb-[5px] max-w-[10ch] whitespace-nowrap overflow-hidden text-ellipsis">
                {journal.title}
              </p>
              <p className="line-clamp-1 font-poppins text-[16px] text-[#3F356E] font-normal max-w-[20ch] whitespace-nowrap overflow-hidden text-ellipsis">
                {journal.entry}
              </p>
            </div>
          ))
        )}
      </div>
      <LoadingModal open={isLoading} />
    </div>
  );
};

export default JournalHome;
