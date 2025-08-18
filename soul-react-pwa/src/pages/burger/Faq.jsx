import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { get } from "../../utils/axios";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { setIsLoading } from "../../redux/appsettingSlice";
import ToastLayout from "../../components/ToastLayout";
import toast from "react-simple-toasts";

const Faq = () => {
  const [faqs, setFaqs] = useState([]);
  const [openId, setOpenId] = useState(null);

  const dispatch = useDispatch();
  const renderStatus = useRef(false);

  const toggle = (id) => {
    setOpenId(openId === id ? null : id);
  };

  useEffect(() => {
    const fetchFaqs = async () => {
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const response = await get("/faq/list");
        // Check if the response is successful
        if (!response.data.status) {
          toast(
            <ToastLayout message={response.data.message} type="fail-toast" />,
            {
              className: "fail-toast",
            }
          );
          return;
        } else {
          setFaqs(response.data.result);
        }
      } catch (error) {
        dispatch(setIsLoading({ isLoading: false }));

        toast(
          <ToastLayout message="Something went wrong." type="fail-toast" />,
          {
            className: "fail-toast",
          }
        );
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };

    // Fetch FAQs only if not already fetched
    if (!renderStatus.current) {
      renderStatus.current = true;
      fetchFaqs();
    }
  }, []);

  return (
    <div>
      <p className="font-poppins font-semibold text-white text-2xl text-center pt-5 pb-5">
        FAQ
      </p>
      <div className="px-4 mt-4 max-w-2xl mx-auto">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="bg-[#6281DF88] rounded-lg mt-3 p-4 text-white cursor-pointer transition-all faq-list"
            onClick={() => toggle(faq.id)}
          >
            <div className="flex justify-between items-center">
              <h2 className="text-base   leading-relaxed font-poppins text-white">
                {faq.question}
              </h2>
              <span>
                {openId === faq.id ? <ExpandMoreIcon /> : <ExpandLessIcon />}
              </span>
            </div>
            <div
              className={`transition-all overflow-hidden duration-300 ${
                openId === faq.id ? "mt-3" : "max-h-0"
              }`}
            >
              <p className="mt-2 text-base leading-relaxed font-poppins text-gray-200">
                {faq.answer}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Faq;
