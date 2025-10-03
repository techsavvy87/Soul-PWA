import { useSelector } from "react-redux";
import LoadingModal from "./LoadingModal";
import AppHeader from "./AppHeader";

const LayoutBurger = ({ children }) => {
  const { isLoading } = useSelector((state) => state.appsetting);
  return (
    <div className="min-h-screen layout-burger px-5 pt-8 pb-5">
      <AppHeader />
      {children}
      <LoadingModal open={isLoading} />
    </div>
  );
};
export default LayoutBurger;
