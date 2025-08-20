import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NavigationDrawer from "../../components/NavigationDrawer";
import { get } from "../../utils/axios";
import { siteBaseUrl } from "../../utils/constants";
import { setIsLoading } from "../../redux/appsettingSlice";
import { useDispatch, useSelector } from "react-redux";
import LoadingModal from "../../components/LoadingModal";
import lock from "../../assets/imgs/lock.png";
import Tooltip from "@mui/material/Tooltip";
import { NEW_PUSH_NOTI_PUBLIC_KEY } from "../../utils/constants";
import { post } from "../../utils/axios";

const Home = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasSubmitted = useRef(false);

  const { isLoading } = useSelector((state) => state.appsetting);

  // Check if user is paid or free.
  const userTier = useSelector((state) => state.auth.user.tier);

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
    }

    subscribeNotification();
  }, []);

  // Free Iamge Click
  const onClickFreeImg = (type, name) => {
    window.sessionStorage.setItem("tier", userTier);
    window.sessionStorage.setItem("type", type);
    window.sessionStorage.setItem("eventName", name);

    // In case event is Emotional or Guidance.
    if (type === "All") {
      navigate("/emotional");
      return;
    }
    navigate("/cards");
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
      <div className="flex justify-between items-center">
        <p className="font-poppins text-white font-medium text-[18.5px]">
          Welcome Back, Paul&nbsp;&nbsp;✨
        </p>
        <NavigationDrawer />
      </div>
      <p className="font-poppins text-white font-light text-[13px] pt-5 pb-10">
        Choose the situation that resonates <br /> and reveal your next step.
      </p>
      <div className="grid grid-cols-2 gap-4">
        {events.map((event, index) => (
          <div className="relative w-full" key={index}>
            {/* {userTier === "Free" && event.level === "Paid" ? (
              <Tooltip title="Upgrade to Paid" className="cursor-not-allowed">
                <span className="absolute inset-0 z-10 cursor-not-allowed py-4 px-5" />
              </Tooltip>
            ) : null} */}
            <div
              key={index}
              className={`relative ${
                userTier === "Free" && event.level === "Paid"
                  ? "blur-[3px] img-disabled"
                  : ""
              }`}
              onClick={() => onClickFreeImg(event.type, event.cname)}
            >
              <img
                src={siteBaseUrl + "deckcardcategories/" + event.info_img}
                alt={`event-${index}`}
                className="rounded-[16px] min-w-full h-[150px] object-cover"
              />
              <p className="w-full font-poppins text-[13.5px] text-white text-center absolute top-[80%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                {event.cname}
              </p>
            </div>

            {userTier === "Free" && event.level === "Paid" && (
              <>
                <img
                  src={lock}
                  alt="locked"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                />
                <p className="absolute font-poppins text-[13.5px] text-white/60 top-[85%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  Locked
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
