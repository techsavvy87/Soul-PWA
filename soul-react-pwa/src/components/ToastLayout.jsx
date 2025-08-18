import toast from "react-simple-toasts";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const ToastLayout = ({ message, type }) => (
  <div className="flex items-center gap-2 font-poppins font-medium text-[14px] leading-5">
    {type === "fail-toast" ? (
      <WarningIcon className="w-[20px]" />
    ) : (
      <CheckCircleIcon className="w-[20px]" />
    )}
    <span>{message}</span>
  </div>
);

export default ToastLayout;
