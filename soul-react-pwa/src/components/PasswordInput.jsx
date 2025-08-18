import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const PasswordInput = (props) => {
  const { password, onChangePassword, placeholder } = props;

  const [showPwd, setShowPwd] = useState(false);

  return (
    <div className="relative">
      <input
        type={showPwd ? "text" : "password"}
        className="bg-[#FDFDFB] border-none mt-4 bg-primary-color border border-gray-300 text-gray-900 text-base rounded-md focus:outline-none focus:ring-0 block w-full p-2.5 "
        placeholder={placeholder || "Password"}
        required
        value={password}
        onChange={onChangePassword}
      ></input>
      <div
        className="absolute inset-y-0 end-0 flex items-center pe-3.5"
        onClick={() => setShowPwd(!showPwd)}
      >
        {showPwd ? (
          <VisibilityIcon className="w-4 h-4 text-gray-300" />
        ) : (
          <VisibilityOffIcon className="w-4 h-4 text-gray-300" />
        )}
      </div>
    </div>
  );
};

export default PasswordInput;
