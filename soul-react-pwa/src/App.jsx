import { Fragment, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./utils/routes";
import { toastConfig } from "react-simple-toasts";
import NotificationModal from "./components/NotificationModal";
import { useDispatch } from "react-redux";
import { setIsShowPlan } from "./redux/appsettingSlice";
import { updateUser } from "./redux/authSlice";
import "react-simple-toasts/dist/style.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
// import "./App.css";

toastConfig({ theme: "success", position: "top-center" });

function App() {
  const [isNotification, setIsNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationDescription, setNotificationDescription] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    onPushNotification();

    // Show subscription modal every 5 seconds
    const subscriptionModal = setInterval(() => {
      dispatch(setIsShowPlan({ isShowPlan: true }));
    }, 1000 * 60 * 5);

    return () => clearInterval(subscriptionModal);
  }, []);

  const onPushNotification = async () => {
    navigator.serviceWorker.addEventListener("message", (event) => {
      setNotificationTitle(event.data.title || "");
      setNotificationDescription(event.data.body || "");
      setIsNotification(true);
      console.log("Push notification received:", event.data);
      if (event.data.data?.context === "paypal") {
        console.log("PayPal");
        dispatch(
          updateUser({
            subscription: false,
            tier: "Free",
          })
        );
        sessionStorage.setItem("subscription", false);
        sessionStorage.setItem("tier", "Free");
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
