import { Fragment, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./utils/routes";
import { toastConfig } from "react-simple-toasts";
import NotificationModal from "./components/NotificationModal";
import { useDispatch } from "react-redux";
import { setIsShowPlan } from "./redux/appsettingSlice";
import { updateUser } from "./redux/authSlice";
import { getWithParams } from "./utils/axios";
import "react-simple-toasts/dist/style.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";

toastConfig({ theme: "success", position: "top-center" });

function App() {
  const [isNotification, setIsNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationDescription, setNotificationDescription] = useState("");
  const dispatch = useDispatch();

  // ✅ Safely parse user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const userId = storedUser?.id;

  useEffect(() => {
    const checkSubscription = async () => {
      if (!userId) return; // ✅ Skip if no user logged in

      try {
        dispatch(setIsShowPlan({ isShowPlan: true }));

        const result = await getWithParams(
          `/users/${userId}/subscription/end-date`
        );

        const planEndedDate = result.data.result.plan_ended_date;
        localStorage.setItem("plan_ended_date", planEndedDate);

        if (planEndedDate && new Date(planEndedDate) < new Date()) {
          dispatch(updateUser({ tier: "free" }));
          localStorage.setItem("tier", "free");
          getWithParams(`/users/${userId}/subscription/status`).catch((err) =>
            console.error("Error subscription:", err)
          );
        }
      } catch (error) {
        console.error("Error checking subscription:", error);
      }
    };

    checkSubscription();
    const subscriptionModal = setInterval(checkSubscription, 1000 * 60 * 5);

    onPushNotification();
    return () => clearInterval(subscriptionModal);
  }, [userId, dispatch]);

  const onPushNotification = async () => {
    navigator.serviceWorker.addEventListener("message", (event) => {
      setNotificationTitle(event.data.title || "");
      setNotificationDescription(event.data.body || "");
      setIsNotification(true);
      console.log("Push notification received:", event.data);

      if (event.data.data?.context === "paypal") {
        console.log("PayPal");
        dispatch(updateUser({ tier: "free" }));
        localStorage.setItem("tier", "free");
      }
    });
  };

  return (
    <Fragment>
      <BrowserRouter>
        <Routes>
          {routes.map((route, idx) => {
            const Component = route.component;
            const Layout = route.layout || Fragment;
            const AuthRequire = route.guard || Fragment;
            return (
              <Route
                key={idx}
                path={route.path}
                element={
                  <AuthRequire>
                    <Layout>{Component}</Layout>
                  </AuthRequire>
                }
              />
            );
          })}
        </Routes>
      </BrowserRouter>

      <NotificationModal
        open={isNotification}
        onClose={() => setIsNotification(false)}
        title={notificationTitle}
        description={notificationDescription}
      />
    </Fragment>
  );
}

export default App;
