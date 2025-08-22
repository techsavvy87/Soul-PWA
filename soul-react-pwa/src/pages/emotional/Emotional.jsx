import { useEffect, useState, useRef } from "react";
import Checkbox from "@mui/material/Checkbox";
import NavigationDrawer from "../../components/NavigationDrawer";
import { setIsLoading } from "../../redux/appsettingSlice";
import { useSelector, useDispatch } from "react-redux";
import LoadingModal from "../../components/LoadingModal";
import { post } from "../../utils/axios";
import { SvgIcon } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import ToastLayout from "../../components/ToastLayout";
import toast from "react-simple-toasts";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const Emotional = () => {
  let tier = sessionStorage.getItem("tier");
  let type = sessionStorage.getItem("type");
  let name = sessionStorage.getItem("eventName");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state) => state.appsetting);
  const [emotions, setEmotions] = useState([]);

  const url = "/get-status-emotion";

  const hasSubmitted = useRef(false);

  // Ensure `checkedStates` is initialized properly to avoid it being undefined
  const [checkedStates, setCheckedStates] = useState({});

  // Handle checkbox state change
  const handleCheckboxChange = (emotionId) => (event) => {
    // Count how many items are checked (true)
    const selectedCount = Object.values(checkedStates).filter(
      (value) => value === true
    ).length;

    // If 3 items are already checked, prevent selecting more
    if (selectedCount >= 3 && event.target.checked) {
      toast(
        <ToastLayout
          message="You can select up to 3 items only."
          type="fail-toast"
        />,
        {
          className: "fail-toast",
        }
      );
      return; // Don't update the state if 3 items are already checked
    }

    setCheckedStates((prev) => ({
      ...prev,
      [emotionId]: event.target.checked,
    }));
  };

  useEffect(() => {
    const getEmotions = async () => {
      const data = {
        tier,
        type,
        name,
      };
      dispatch(setIsLoading({ isLoading: true }));
      try {
        const response = await post(url, data);
        const emotionList = response.data.result;
        setEmotions(emotionList);

        // Initialize checkedStates for each emotion after fetching emotions
        setCheckedStates((prevCheckedStates) => {
          const updatedCheckedStates = { ...prevCheckedStates };
          emotionList.forEach((emotion) => {
            if (updatedCheckedStates[emotion.id] === undefined) {
              updatedCheckedStates[emotion.id] = false; // Default unchecked state
            }
          });
          return updatedCheckedStates;
        });
      } catch (error) {
        console.log("Error:", error);
      } finally {
        dispatch(setIsLoading({ isLoading: false }));
      }
    };

    if (!hasSubmitted.current) {
      hasSubmitted.current = true;
      getEmotions();
    }
  }, []); // This effect only runs once when the component mounts

  const onClickOKBtn = () => {
    navigate("/cards");
  };

  return (
    <div className="min-h-screen emotional px-5 py-10">
      <div className="flex justify-between">
        <button
          className="mb-5 w-12 h-12 rounded-full bg-[#8690FD] flex items-center justify-center text-white hover:bg-gray-700 transition"
          onClick={() => navigate(-1)}
        >
          <ArrowBackIcon size={24} />
        </button>
        <NavigationDrawer />
      </div>
      <p className="font-poppins font-semibold text-white text-2xl text-center pt-8">
        {name}
      </p>
      <p className="font-poppins text-white font-light text-[13px] pt-5 pb-10 text-center">
        Select up to three situations you’re currently facing <br />
      </p>
      {emotions.map((emotion) => (
        <div
          className={`flex justify-between items-center px-[35px] py-[10px] mb-5 rounded-[12px] ${
            checkedStates[emotion.id]
              ? "situation-checked"
              : "situation-unchecked"
          }`}
          key={emotion.id}
          onClick={() => {
            // Toggle manually
            const selectedCount = Object.values(checkedStates).filter(
              (v) => v
            ).length;

            if (!checkedStates[emotion.id] && selectedCount >= 3) {
              toast(
                <ToastLayout
                  message="You can select up to 3 items only."
                  type="fail-toast"
                />,
                { className: "fail-toast" }
              );
              return;
            }

            setCheckedStates((prev) => ({
              ...prev,
              [emotion.id]: !prev[emotion.id],
            }));
          }}
        >
          <p className="font-poppins text-4">{emotion.name}</p>
          <Checkbox
            checked={checkedStates[emotion.id]}
            checkedIcon={
              <SvgIcon
                sx={{
                  background: checkedStates[emotion.id] ? "#5847C2" : "yellow",
                  borderRadius: "5px",
                  border: checkedStates[emotion.id]
                    ? "none"
                    : "1px solid white",
                  padding: checkedStates[emotion.id] ? "3px" : "0",
                }}
              >
                <CheckIcon
                  sx={{ color: checkedStates[emotion.id] ? "white" : "black" }}
                />
              </SvgIcon>
            }
            icon={
              <SvgIcon
                sx={{
                  background: "transparent",
                  borderRadius: "5px",
                  border: "1px solid rgba(255, 255, 255, 0.5)",
                }}
              >
                <CheckIcon sx={{ color: "transparent" }} />
              </SvgIcon>
            }
            sx={{
              "& .MuiSvgIcon-root": {
                transition: "color 0.3s ease, background 0.3s ease",
              },
            }}
          />
        </div>
      ))}

      <button
        type="button"
        className="shadow-[inset_0_0_10px_rgba(255,255,255,0.4)] tracking-wide font-poppins font-semibold text-white uppercase mt-8 bg-[#8690FD] rounded-[38px] text-md w-full px-5 py-4 text-center"
        onClick={() => onClickOKBtn()}
      >
        OK
      </button>
      <LoadingModal open={isLoading} />
    </div>
  );
};

export default Emotional;
