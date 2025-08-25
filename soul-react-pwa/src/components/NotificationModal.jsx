import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import CloseIcon from "@mui/icons-material/Close";
import LogoSusan from "../assets/imgs/logo.png";

const NotificationModal = ({ open, onClose, title, description }) => {
  const styles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.3)",
    },
    modal: {
      width: "90%",
      borderRadius: 8,
      border: "1px solid #ebd371",
      background: "linear-gradient(to bottom, #ca2b82, #505095)",
    },
  };

  return (
    <Modal
      open={open}
      center
      onClose={onClose}
      styles={styles}
      closeIcon={
        <CloseIcon className="text-gray-200 focus:ring-0 focus:outline-none" />
      }
    >
      <div className="flex items-center gap-4">
        <img
          src={LogoSusan}
          className="w-1/5 h-auto rounded-md"
          alt="Push Notification"
        />
        <div>
          <p className="text-[#ebd371] font-poppins font-semibold">{title}</p>
          <p className="text-gray-100  text-[15px] font-poppins leading-5 pt-1">
            {description}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default NotificationModal;
