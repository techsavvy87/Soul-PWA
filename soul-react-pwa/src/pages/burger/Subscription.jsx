import { useState, useEffect, useRef } from "react";
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import Badge from "../../components/Badge";
import { get } from "../../utils/axios";
import { post } from "../../utils/axios";
import { setIsLoading } from "../../redux/appsettingSlice";
import { useDispatch, useSelector } from "react-redux";
import { PAYPAL_CLIENT_ID } from "../../utils/constants";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import toast from "react-simple-toasts";
import ToastLayout from "../../components/ToastLayout";
import { login } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "../../components/ConfirmDialog";
import SubHeader from "../../components/SubHeader";
import Radio from "@mui/material/Radio";
import DoneIcon from "@mui/icons-material/Done";

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  // checkedPlanId: ID of the currently subscribed plan
  const [checkedPlanId, setCheckedPlanId] = useState(null);
  const [savePercent, setSavePercent] = useState(0);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedRadioTier, setSelectedRadioTier] = useState(null);
  const [planTier, setPlanTier] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);
  let realSubscriptionStatus = "";
  const userPlanEndedDate = useSelector((state) => state.auth.plan_ended_date);
  const userEmail = useSelector((state) => state.auth.user.email);

  // Subscription ID for the current user
  const [subscriptionID, setSubscriptionID] = useState("");

  const hasRendered = useRef(false);
  // Ref to check if the plan is already subscribed.
  const onlyOnce = useRef(false);

  const FREEACCESSLIST = [
    "4 Reading Types",
    "1 Personality Deck",
    "The Shankara Release Deck",
    "Basic Features Forever",
  ];
  const PAIDACCESSLIST = [
    "All 7 Reading Types - Unlocked",
    "All 3 Personality Card Decks - Unlocked",
    "All 3 Shankara Oracle Decks - Unlocked",
    "The Transcend Deck - Unlocked",
    "The Blended Soul Journal - Unlocked",
    "Quarterly Live Group Session - Unlocked",
  ];

  // const handleRadioChange = (event) => {
  //   setSelectedRadioTier(event.target.value);
  //   if (event.target.value === "free") {
  //     setSelectedPlan(null);
  //     setCheckedPlanId(null);
  //     setPlanTier(null);
  //   }
  // };

  const handleRadioChange = (value) => {
    setSelectedRadioTier(value);
    if (value === "free") {
      setSelectedPlan(null);
      setCheckedPlanId(null);
      setPlanTier(null);
    }
  };

  useEffect(() => {
    const getPlans = async () => {
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const result = await get("/get-plans");
        const resResult = result.data;
        if (resResult.status) {
          setPlans(resResult.result.plans);
          // Determine if user is subscribed to free plan.
          realSubscriptionStatus = resResult.result.realSubscription;

          const monthlyTier = resResult.result.plans.find(
            (tier) => tier.interval_unit === "month"
          );
          const annualTier = resResult.result.plans.find(
            (tier) => tier.interval_unit === "year"
          );
          if (monthlyTier && annualTier) {
            const percent = Math.round(
              ((monthlyTier.price * 12 - annualTier.price) /
                (monthlyTier.price * 12)) *
                100
            );
            setSavePercent(percent);
          }

          // Determine if plan is subscribed
          const subscribedPlan = resResult.result.plans.find(
            (plan) => plan.is_subscribed === true
          );

          // In case user is already subscribed.
          if (subscribedPlan) {
            setCheckedPlanId(subscribedPlan.id);
            setSubscriptionID(subscribedPlan.subscription_id);
            onlyOnce.current = true;
          }
        }
      } catch (error) {
        console.error("Error fetching plans:", error);
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };

    if (!hasRendered.current) {
      hasRendered.current = true;
      getPlans();
    }
  }, []);

  const handleSubscriptionApprove = async (data, actions, navigate) => {
    try {
      // 1. Get subscription details from PayPal
      const subscription = await actions.subscription.get();
      const periodStart =
        subscription.billing_info.last_payment?.time || subscription.start_time;
      const periodEnd = subscription.billing_info.next_billing_time;

      // 2. Save subscription to backend
      const response = await post("/subscriptions", {
        subscription_id: subscription.id,
        plan_status: subscription.status,
        plan_id: checkedPlanId,
        plan_started_date: periodStart,
        plan_ended_date: periodEnd,
        subscription_status: planTier,
      });

      // 3. Redirect after backend confirmation
      if (subscription.status === "ACTIVE") {
        window.localStorage.setItem("tier", "Paid");
        window.localStorage.setItem("plan_ended_date", periodEnd);
        dispatch(
          login({
            ...authState,
            tier: "Paid",
            plan_ended_date: periodEnd,
          })
        );
        navigate("/", { state: { from: "subscription" } });
      } else {
        toast(
          <ToastLayout
            message={`Subscription saved, but status is: ${subscription.status}`}
            type="fail-toast"
          />,
          {
            className: "fail-toast",
          }
        );
      }
    } catch (err) {
      console.error("Error during subscription approval:", err);
      toast(
        <ToastLayout
          message="Could not complete subscription. Please contact support."
          type="fail-toast"
        />,
        {
          className: "fail-toast",
        }
      );
    }
  };

  const handlePlanSelect = (plan) => {
    if (!onlyOnce.current) {
      if (selectedRadioTier === "paid") {
        setSelectedPlan(plan);
        setCheckedPlanId(plan.id);
        setPlanTier(plan.tier);
      } else {
        toast(
          <ToastLayout
            message="Sorry, you have to check paid plan first."
            type="fail-toast"
          />,
          {
            className: "fail-toast",
          }
        );
      }
    } else {
      toast(
        <ToastLayout
          message="You’ve already selected a plan. Please cancel your current plan before choosing a new one."
          type="fail-toast"
        />,
        {
          className: "fail-toast",
        }
      );
    }
  };

  // Subscription Popup
  const handlePlanCancel = async (flag) => {
    // If user click "Keep Subscription" button
    if (!flag) {
      setShowCancelDialog(false);
      return;
    }

    setShowCancelDialog(false);
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const cancelUrl = "/cancel-subscription";
      const result = await post(cancelUrl, {
        subscription_id: subscriptionID,
        plan_ended_date: userPlanEndedDate,
        email: userEmail,
      });
      const resResult = result.data;

      if (resResult.status) {
        setCheckedPlanId(null);
        setSelectedPlan(null);
        toast(
          <ToastLayout
            message="Subscription cancelled successfully."
            type="success-toast"
          />,
          {
            className: "success-toast",
          }
        );
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error);
      toast(
        <ToastLayout
          message="Could not cancel subscription. Please contact support."
          type="fail-toast"
        />,
        {
          className: "fail-toast",
        }
      );
    } finally {
      dispatch(setIsLoading({ isLoading: false }));
    }
  };

  const handleCloseDialog = () => {
    setShowCancelDialog(false);
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id": PAYPAL_CLIENT_ID,
        vault: true,
        intent: "subscription",
        "disable-funding": "card,credit,paylater",
      }}
    >
      <div className="flex items-center">
        <div>
          <SubHeader pageName="Choose Your Plan" textColor="white" />
          <div>
            <div
              className="flex items-center"
              onClick={() => handleRadioChange("free")}
            >
              <Radio
                checked={selectedRadioTier === "free"}
                name="radio-buttons"
                sx={{
                  color: "white", // default border color (gray)
                  "&.Mui-checked": {
                    color: "white", // circle color when selected
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: 28, // optional: make radio larger
                  },
                }}
              />
              <p className="font-poppins text-white text-[20px] font-bold">
                FREE - Limited Access
              </p>
            </div>
            <ul className="text-white font-poppins text-[14px]">
              {FREEACCESSLIST.map((item, idx) => (
                <li className="flex items-center" key={idx}>
                  <DoneIcon className="mx-[9px]" />
                  {item}
                </li>
              ))}
            </ul>
            <div
              className="flex items-center mt-5"
              onClick={() => handleRadioChange("paid")}
            >
              <Radio
                checked={selectedRadioTier === "paid"}
                name="radio-buttons"
                sx={{
                  color: "white", // default border color (gray)
                  "&.Mui-checked": {
                    color: "white", // circle color when selected
                  },
                  "& .MuiSvgIcon-root": {
                    fontSize: 28, // optional: make radio larger
                  },
                }}
              />
              <p className="font-poppins text-white text-[20px] font-bold">
                PAID - Unlimited Access
              </p>
            </div>
            <ul className="text-white font-poppins text-[14px]">
              {PAIDACCESSLIST.map((item, idx) => (
                <li className="flex items-center" key={idx}>
                  <DoneIcon className="mx-[9px]" />
                  {item}
                </li>
              ))}
              <li className="flex items-center">
                <DoneIcon className="mx-[9px]" />
                {`${savePercent}% Discount On Paul's Sessions (Annual)`}
              </li>
            </ul>
          </div>

          <div className="mt-10">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`flex justify-between items-center px-4 py-5 border-2  rounded-md cursor-pointer transition mt-5 ${
                  checkedPlanId === plan.id
                    ? "situation-checked"
                    : "situation-unchecked"
                }`}
                onClick={() => handlePlanSelect(plan)}
              >
                <div className="flex items-center space-x-2">
                  {checkedPlanId === plan.id ? (
                    <RadioButtonCheckedIcon className="text-white text-[20px]" />
                  ) : (
                    <RadioButtonUncheckedIcon className="text-white text-[20px]" />
                  )}
                  <span className="text-white font-ovo text-[18px]">
                    {plan.interval_unit === "month" ? "Monthly" : "Annual"}
                  </span>

                  {plan.interval_unit === "year" && (
                    <Badge
                      classes="bg-green-900"
                      label={`Save ${savePercent}%`}
                    />
                  )}
                </div>
                <div>
                  <span className="text-gray-100 font-lora">${plan.price}</span>
                  <span className="text-gray-400 font-lora">
                    /{plan.interval_unit === "month" ? "Month" : "Year"}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20 }}>
            <PayPalButtons
              createSubscription={(data, actions) => {
                return actions.subscription.create({
                  plan_id: selectedPlan.plan_id, // use the selected plan
                });
              }}
              forceReRender={[selectedPlan?.plan_id]}
              disabled={!selectedPlan?.plan_id}
              onApprove={(data, actions) =>
                handleSubscriptionApprove(data, actions, navigate)
              }
              onError={(err) => console.error(err)}
            />
          </div>
          {(realSubscriptionStatus === "monthly" ||
            realSubscriptionStatus === "annual") && (
            <p
              className="text-[18px] text-center font-poppins pt-6 font-semibold"
              onClick={() => setShowCancelDialog(true)}
            >
              Cancel Plan
            </p>
          )}
        </div>
        <ConfirmDialog
          isOpen={showCancelDialog}
          onClick={handlePlanCancel}
          onClose={handleCloseDialog}
          planEndedDate={userPlanEndedDate}
        />
      </div>
    </PayPalScriptProvider>
  );
};

export default Subscription;
