import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { login } from "../redux/authSlice";
import SubscriptionModal from "./SubscriptionModal";
import { setIsShowPlan } from "../redux/appsettingSlice";

const AuthRequire = ({ children }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const pagePath = location.pathname;

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isShowPlan = useSelector((state) => state.appsetting.isShowPlan);
  const subscriptionStatus = useSelector((state) => state.auth.tier);

  if (!isAuthenticated) {
    // when redux store is initialized but data in localstorage is still alive, then get data from
    // localstorage and restructure the redux store auth data.
    let isAuthStorage = localStorage.getItem("isAuthenticated");
    if (isAuthStorage === "done") {
      let userStorage = localStorage.getItem("user");
      let tokenStorage = localStorage.getItem("token");
      let tierStorage = localStorage.getItem("tier");
      let planEndedDate = localStorage.getItem("plan_ended_date");

      dispatch(
        login({
          isAuthenticated: true,
          user: JSON.parse(userStorage),
          token: tokenStorage,
          tier: tierStorage,
          plan_ended_date: planEndedDate,
        })
      );
    } else {
      return <Navigate to="/login" />;
    }
  }

  return (
    <>
      {children}

      {pagePath !== "/subscription" && (
        <SubscriptionModal
          open={isShowPlan && subscriptionStatus === "free"}
          onClose={() => dispatch(setIsShowPlan({ isShowPlan: false }))}
          closeOnOverlayClick={true}
          title="Ready to go deeper?"
          description="Get full access to mystical card decks, guided meditations, and soulful sessions with Susan."
        />
      )}
    </>
  );
};

export default AuthRequire;
