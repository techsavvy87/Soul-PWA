import { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import NavigationDrawer from "../../components/NavigationDrawer";
import { get } from "../../utils/axios";
import { siteBaseUrl } from "../../utils/constants";
import { setIsLoading, setPrevPageName } from "../../redux/appsettingSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "../../components/LoadingModal";
import lockImg from "../../assets/imgs/lock.png";
import Tooltip from "@mui/material/Tooltip";
import { NEW_PUSH_NOTI_PUBLIC_KEY } from "../../utils/constants";
import { post } from "../../utils/axios";
import toast from "react-simple-toasts";
import ToastLayout from "../../components/ToastLayout";
import ArrowImg from "../../assets/imgs/arrow.png";

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
    window.sessionStorage.setItem("tier", userTier);
    window.sessionStorage.setItem("type", type);
    window.sessionStorage.setItem("eventName", name);
    window.sessionStorage.setItem("eventId", id);

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
      <p className="font-poppins text-[#FFFFFFFA] font-light text-[14px] py-[25px]">
        To awaken and heal, choose the reading that resonates.
      </p>
      <div>
        {events.map((event, index) => (
          <div
            className={`flex justify-between items-center border border-[#FFFFFF80] rounded-[12px] pl-3 pr-[14px] py-2 mb-3 
                        ${
                          userTier === "Free" && event.level === "Paid"
                            ? "bg-[#4333B2]/30"
                            : ""
                        }`}
            style={{
              boxShadow: "inset 0px 4px 24px 0px rgba(252, 230, 255, 0.2)",
            }}
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
            <div
              className={`flex items-center ${
                userTier === "Free" && event.level === "Paid" ? "z-[-1]" : ""
              }`}
            >
              <img
                src={siteBaseUrl + "events/" + event.img_url}
                alt={`event-${index}`}
              />
              <p className="font-poppins text-[18px] text-white text-center font-normal leading-[130%] ml-5">
                {event.name}
              </p>
            </div>
            <div className="flex items-center">
              {userTier === "Free" && event.level === "Paid" && (
                <img
                  className="w-[21px] h-[26px] mr-5"
                  src={lockImg}
                  alt="lock"
                />
              )}
              <img
                className={`w-[7px] h-[14px] ${
                  userTier === "Free" && event.level === "Paid" ? "z-[-1]" : ""
                }`}
                src={ArrowImg}
                alt="arrow"
              />
            </div>
          </div>
        ))}
      </div>
      <LoadingModal open={isLoading} />
    </div>
  );
};
export default Home;
