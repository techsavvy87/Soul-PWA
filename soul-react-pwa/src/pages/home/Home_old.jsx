import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationDrawer from "../../components/NavigationDrawer";
import { get } from "../../utils/axios";
import { siteBaseUrl } from "../../utils/constants";
import { setIsLoading, setPrevPageName } from "../../redux/appsettingSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "../../components/LoadingModal";
import lock from "../../assets/imgs/lock.png";
import Tooltip from "@mui/material/Tooltip";
import { NEW_PUSH_NOTI_PUBLIC_KEY } from "../../utils/constants";
import { post } from "../../utils/axios";
import toast from "react-simple-toasts";
import ToastLayout from "../../components/ToastLayout";
import LogoImg from "../../assets/imgs/logo.png";

const Home = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const hasSubmitted = useRef(false);

  const { isLoading } = useSelector((state) => state.appsetting);

  // Check if user is paid or free.
  const userTier = useSelector((state) => state.auth.tier);

  useEffect(() => {
    const getEvents = async () => {
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const response = await get("/all-events");
        setEvents(response.data.result);
      } catch (error) {
        console.log("Error:", error);
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };

    if (!hasSubmitted.current) {
      hasSubmitted.current = true;
      getEvents();

      const fromPage = location.state?.from;
      if (fromPage === "subscription") {
        toast(
          <ToastLayout
            message="Subscription successful! Enjoy your upgraded access."
            type="success-toast"
          />,
          {
            className: "success-toast",
          }
        );
        // Clear the state to prevent repeated toasts on re-renders
        navigate(location.pathname, { replace: true, state: {} });
      }
    }

    subscribeNotification();
  }, []);

  // Free Iamge Click
  const onClickFreeImg = (type, name, level, id) => {
    window.localStorage.setItem("tier", userTier);
    window.localStorage.setItem("type", type);
    window.localStorage.setItem("eventName", name);
    window.localStorage.setItem("eventId", id);

    if (userTier === "Free" && level === "Paid") {
      navigate("/subscription");
    } else {
      if (type) {
        navigate("/emotional");
        return;
      } else {
        dispatch(setPrevPageName({ pageName: "home" }));
        navigate("/cards");
      }
    }
  };

  const subscribeNotification = async () => {
    //  Request permission for notifications
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("Permission not granted for Notification");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    try {
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        // check if user was subscribed with a different VAPID key
        let json = subscription.toJSON();
        let publicKey = json?.keys?.p256dh;

        if (publicKey != NEW_PUSH_NOTI_PUBLIC_KEY) {
          await subscription.unsubscribe();
        }
      }
      const newSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        // Replace with your own VAPID public key
        applicationServerKey: NEW_PUSH_NOTI_PUBLIC_KEY,
      });

      const url = "/notification/subscribe";
      try {
        const result = await post(url, newSubscription);
        const resResult = result.data;
        if (resResult.status) {
          console.log("notification subscription success");
        } else {
          console.log("notification subscription failed");
        }
      } catch (err) {
        console.log("Error: ", err);
      }
      console.log("User is subscribed:", newSubscription);
    } catch (err) {
      console.log("Failed to subscribe the user: ", err);
    }
  };

  return (
    <div>
      <p className="font-poppins text-[#FFFFFFFA] font-light text-[12px] py-5">
        To awaken and heal, choose the reading that resonates.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {events.map((event, index) => (
          <div
            className="relative w-full"
            key={index}
            onClick={() =>
              onClickFreeImg(
                event.scroll_sort,
                event.name,
                event.level,
                event.id
              )
            }
          >
            {/* {userTier === "Free" && event.level === "Paid" ? (
              <Tooltip title="Upgrade to Paid" className="cursor-not-allowed">
                <span className="absolute inset-0 z-10 cursor-not-allowed py-4 px-5" />
              </Tooltip>
            ) : null} */}
            <div
              key={index}
              className={`relative ${
                userTier === "Free" && event.level === "Paid"
                  ? "blur-[3px]"
                  : ""
              }`}
            >
              <img
                src={siteBaseUrl + "events/" + event.img_url}
                alt={`event-${index}`}
                className="rounded-[16px] w-full h-auto"
              />
              <p className="w-full font-poppins text-[17.5px] text-white text-center absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                {(userTier === "Free" && event.level === "Free") ||
                userTier === "Paid"
                  ? event.name
                  : null}
              </p>
            </div>

            {userTier === "Free" && event.level === "Paid" && (
              <>
                <img
                  src={lock}
                  alt="locked"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                />
                <p className="w-full font-poppins text-[17.5px] text-white text-center absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  {event.name}
                </p>
              </>
            )}
          </div>
        ))}
      </div>
      <LoadingModal open={isLoading} />
    </div>
  );
};
export default Home;
