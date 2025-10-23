import { useEffect, useRef } from "react";

const ConfirmDialog = ({ isOpen, onClose, onClick, planEndedDate }) => {
  const ref = useRef(null);
  const date = new Date(planEndedDate);
  const formattedEndDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short", // gives "Nov"
    day: "2-digit",
  });

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      onClose(false);
    }
  };

  return (
    <div
      className={`fixed left-0 bottom-0 w-full z-50 transition-transform ease-in-out duration-300 ${
        isOpen ? "translate-y-0" : "translate-y-full"
      }`}
      style={{
        backgroundColor: "#1E234C",
        borderTop: "1px solid rgba(235, 211, 113, 0.16)",
        borderTopLeftRadius: "2rem",
        borderTopRightRadius: "2rem",
      }}
      ref={ref}
    >
      <div className="relative px-6 py-4 text-white text-left">
        <div className="w-10 h-1 bg-gray-400 rounded-full mx-auto mb-4" />

        <h2 className="font-poppins text-xl mb-2">Cancel Subscription?</h2>

        <p className="font-poppins text-md leading-relaxed">
          You'll keep your unlimited access until {formattedEndDate}. After
          that, you can still use Blended Soul for free with limited decks and
          readings. Your account and saved content will be preserved.
        </p>
        <div className="flex justify-between gap-4">
          <button
            type="button"
            className={`font-poppins mt-6 text-black bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 font-bold rounded-md text-md w-full px-5 py-2.5 text-center`}
            onClick={() => onClick(false)}
          >
            Keep Subscription
          </button>
          <button
            type="button"
            className={`font-poppins mt-6 text-black bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 font-bold rounded-md text-md w-full px-5 py-2.5 text-center`}
            onClick={() => onClick(true)}
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
