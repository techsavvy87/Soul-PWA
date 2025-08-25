import { useEffect, useRef } from "react";

const ConfirmDialog = ({ isOpen, onClose, onClick, description }) => {
  const ref = useRef(null);

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

        <h2 className="font-ovo text-xl mb-2">Are you sure?</h2>

        <p className="font-lora text-md leading-relaxed">
          {description ??
            "Once you press ok, you won't be able to undo your action."}
        </p>

        <button
          type="button"
          className={`mt-6 text-black bg-gradient-to-r from-amber-400 via-amber-200 to-amber-400 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 font-lora font-bold rounded-md text-md w-full px-5 py-2.5 text-center`}
          onClick={() => onClick(true)}
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ConfirmDialog;
