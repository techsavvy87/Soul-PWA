import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

const SubscriptionModal = ({
  open,
  onClose,
  title,
  description,
  closeOnOverlayClick,
}) => {
  const navigate = useNavigate();
  const styles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    modal: {
      width: "88%",
      borderRadius: 8,
      border: "1px solid #7e9ef7",
      background: "linear-gradient(to bottom, #ca2b82, #505095)",
    },
  };

  const onSeePlans = () => {
    onClose();
    navigate("/subscription");
  };

  return (
    <Modal
      open={open}
      center
      closeOnOverlayClick={closeOnOverlayClick}
      onClose={onClose}
      styles={styles}
      closeIcon={
        <CloseIcon className="text-gray-200 focus:ring-0 focus:outline-none" />
      }
    >
      <div className="mx-3 mt-6">
        <p className="text-[#ebd371] font-poppins font-semibold text-[20px] text-center">
          {title}
        </p>
        <p className="text-gray-100 text-[15px] font-poppins pt-5 px-4 pb-7 text-center">
          {description}
        </p>
        <button
          type="button"
          className="text-black bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 font-poppins font-bold rounded-md text-md w-full px-5 py-2.5 text-center"
          onClick={onSeePlans}
        >
          See Plans
        </button>
      </div>
    </Modal>
  );
};

export default SubscriptionModal;
