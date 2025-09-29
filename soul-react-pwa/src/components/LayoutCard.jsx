import { useState, useEffect } from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useSelector, useDispatch } from "react-redux";
import LoadingModal from "./LoadingModal";
import { post } from "../utils/axios";
import { useNavigate, useLocation } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IoIosSend } from "react-icons/io";
import { Modal } from "react-responsive-modal";
import CloseIcon from "@mui/icons-material/Close";
import "react-responsive-modal/styles.css";
import toast from "react-simple-toasts";
import ToastLayout from "./ToastLayout";
import { setIsLoading } from "../redux/appsettingSlice";
import { hostingDomain } from "../utils/constants";
import FlipImg from "../assets/imgs/flip.png";

const LayoutCard = ({ children }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [email, setEmail] = useState("");
  const { isLoading } = useSelector((state) => state.appsetting);
  const userId = useSelector((state) => state.auth.user.id);
  const cardId = window.sessionStorage.getItem("cardId");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const path = location.pathname;
  const elementEmpty = useSelector((state) => state.appsetting.elementEmpty);
  const type = "card";

  const onClickFavoriteIcon = () => {
    try {
      post("/toggle-favorite", { userId, cardId, type })
        .then((response) => {
          setIsFavorited(!isFavorited);
        })
        .catch((error) => {
          console.error("Error updating favorite status:", error);
        });
    } catch (error) {}
  };

  useEffect(() => {
    const checkIfFavorited = async () => {
      try {
        const result = await post("/check-favorite", {
          userId,
          cardId,
          type,
        });
        setIsFavorited(result.data.isFavorited);
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };
    checkIfFavorited();
  }, [userId, cardId]);

  const handleSendEmail = async () => {
    const mailformat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (mailformat.test(email.trim()) === false) {
      toast(
        <ToastLayout message="Please enter a valid email" type="fail-toast" />,
        {
          className: "fail-toast",
        }
      );
      return;
    }
    const url = "/send-card-email";
    const cardUrl = `${hostingDomain}card/client-detail/${cardId}`;

    try {
      dispatch(setIsLoading({ isLoading: true }));
      const result = await post(url, { email, cardUrl });
      const resResult = result.data;

      if (resResult.status) {
        toast(
          <ToastLayout message={`${resResult.message}`} type="success-toast" />,
          {
            className: "success-toast",
          }
        );

        setOpen(false);
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
      toast(<ToastLayout message="Something went wrong." type="fail-toast" />, {
        className: "fail-toast",
      });
    } finally {
      dispatch(setIsLoading({ isLoading: false }));
    }
  };

  return (
    <div className="min-h-screen layout-card">
      <div className="sticky top-0 mx-4">
        <div className="flex items-center justify-between pt-8">
          <ArrowBackIcon
            className="text-[#8690FD] !w-[35px] !h-[35px]"
            onClick={() => navigate(-1)}
          />
          {!elementEmpty && (
            <div className="flex">
              {!path.startsWith("/card/detail") && (
                <button className="w-12 h-12 rounded-full bg-[#8690FD] flex items-center justify-center text-white hover:bg-gray-700 transition">
                  <IoIosSend size={24} onClick={() => setOpen(true)} />
                </button>
              )}
              <button
                className="w-12 h-12 rounded-full bg-[#8690FD] flex items-center justify-center text-white hover:bg-gray-700 transition mx-2"
                onClick={onClickFavoriteIcon}
              >
                {isFavorited ? (
                  <FavoriteIcon size={24} />
                ) : (
                  <FavoriteBorderIcon size={24} />
                )}
              </button>
              {!(
                path === "/cards" ||
                path === "/cards/" ||
                path.startsWith("/card/detail")
              ) && (
                <button
                  className="w-24 h-12 rounded-full bg-[#8690FD] flex items-center justify-center text-white hover:bg-gray-700 transition"
                  onClick={() => navigate("/card/detail/" + cardId)}
                >
                  <img src={FlipImg} alt="" />
                  <span className="ml-2 font-poppins font-semibold text-[16px]">
                    FLIP
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {children}
      <LoadingModal open={isLoading} />
      {/* Email Modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        center
        showCloseIcon={false}
        classNames={{
          modal: "w-4/5 max-w-none rounded-xl p-6",
        }}
      >
        <div className="flex justify-between items-center">
          <p className="font-poppins font-semibold text-[#3f356e] text-[20px]">
            ✨ Share Your Card
          </p>
          <CloseIcon
            size={14}
            color="#3F356E"
            onClick={() => {
              setOpen(false), setEmail("");
            }}
          />
        </div>
        <p className="font-poppins font-normal text-[#3f356e] text-[14px] my-5">
          Send your card spread to a friend <br /> and let them see the insight
          you <br /> received today.
        </p>
        <input
          type="email"
          className="bg-[#FDFDFB] mt-4 bg-primary-color border border-gray-300 text-gray-900 text-base rounded-md focus:outline-none focus:ring-0 block w-full p-2.5 "
          placeholder="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="button"
          className="w-full mt-4 px-3 py-4 bg-[#3f356e] text-[16px] font-poppins font-semibold let text-white rounded-[38px] tracking-wider"
          onClick={handleSendEmail}
        >
          SEND VIA EMAIL
        </button>
      </Modal>
    </div>
  );
};
export default LayoutCard;
