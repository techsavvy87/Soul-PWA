import { Fragment, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "./utils/routes";
import { toastConfig } from "react-simple-toasts";
import NotificationModal from "./components/NotificationModal";
import "react-simple-toasts/dist/style.css";
import "react-simple-toasts/dist/theme/success.css";
import "react-simple-toasts/dist/theme/failure.css";
// import "./App.css";

toastConfig({ theme: "success", position: "top-center" });

function App() {
  const [isNotification, setIsNotification] = useState(false);
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationDescription, setNotificationDescription] = useState("");

  useEffect(() => {
    onPushNotification();
  }, []);

  const onPushNotification = async () => {
    navigator.serviceWorker.addEventListener("message", (event) => {
      setNotificationTitle(event.data.title || "");
      setNotificationDescription(event.data.body || "");
      setIsNotification(true);
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
