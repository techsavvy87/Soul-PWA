import { useSelector } from "react-redux";
import LoadingModal from "./LoadingModal";

const LayoutLogin = ({ children }) => {
  const { isLoading } = useSelector((state) => state.appsetting);
  return (
    <div className="min-h-screen layout-auth overflow-y-auto flex justify-center items-center ">
      {children}
      <LoadingModal open={isLoading} />
    </div>
  );
};
export default LayoutLogin;
