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

const Subscription = () => {
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [checkedPlanId, setCheckedPlanId] = useState(null);
  const [savePercent, setSavePercent] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authState = useSelector((state) => state.auth);

  const hasRendered = useRef(false);
  const CHECKLIST = [
    "Mystical & body-based card decks",
    "Audio meditations from Susan",
    "Member-only sessions & perks",
  ];

  useEffect(() => {
    const getPlans = async () => {
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const result = await get("/get-plans");
        const resResult = result.data;
        if (resResult.status) {
          setPlans(resResult.result);
          const monthlyTier = resResult.result.find(
            (tier) => tier.interval_unit === "MONTH"
          );
          const annualTier = resResult.result.find(
            (tier) => tier.interval_unit === "YEAR"
          );
          if (monthlyTier && annualTier) {
            const percent = Math.round(
              ((monthlyTier.price * 12 - annualTier.price) /
                (monthlyTier.price * 12)) *
                100
            );
            setSavePercent(percent);
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
      console.log("PayPal subscription object:", subscription);

      // 2. Save subscription to backend
      const response = await post("/subscriptions", {
        subscription_id: subscription.id,
        status: subscription.status,
        plan_id: checkedPlanId,
        period_start: periodStart,
        period_end: periodEnd,
      });

      // 3. Redirect after backend confirmation
      if (subscription.status === "ACTIVE") {
        dispatch(
          login({
            ...authState, // spread existing state
            tier: "Paid", // overwrite tier
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
    setSelectedPlan(plan);
    setCheckedPlanId(plan.id);
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
      <div>
        <p className="font-poppins font-semibold text-white text-2xl text-center pt-5 pb-5">
          Choose Your Plan
        </p>
        <p className="text-center text-[18px] font-ovo text-gray-300 mt-7 mx-8 leading-6">
          Enjoy these perks when you subscribe to the Blended Soul app
        </p>
        <div className="flex justify-center mt-7">
          <ul className="space-y-1.5 text-gray-300 list-inside font-lora text-[17px]">
            {CHECKLIST.map((item, idx) => (
              <li className="flex items-center" key={idx}>
                <svg
                  className="w-5 h-5 me-2 text-gray-300 shrink-0 opacity-60"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                </svg>
                {item}
              </li>
            ))}
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
                  {plan.interval_unit === "MONTH" ? "Monthly" : "Annual"}
                </span>

                {plan.interval_unit === "YEAR" && (
                  <Badge classes="bg-green-900" label={`-${savePercent}%`} />
                )}
              </div>
              <div>
                <span className="text-gray-100 font-lora">${plan.price}</span>
                <span className="text-gray-400 font-lora">
                  /{plan.interval_unit === "MONTH" ? "Month" : "Year"}
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
      </div>
    </PayPalScriptProvider>
  );
};

export default Subscription;
