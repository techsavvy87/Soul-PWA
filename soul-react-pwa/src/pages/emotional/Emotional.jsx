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
import { setPrevPageName } from "../../redux/appsettingSlice";
import AppHeader from "../../components/AppHeader";

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
    const selectedEmotions = Object.keys(checkedStates).filter(
      (emotionId) => checkedStates[emotionId]
    );
    const adjSort = type;
    const adjIds = selectedEmotions;

    if (selectedEmotions.length === 0) {
      toast(
        <ToastLayout
          message="Please select at least one item."
          type="fail-toast"
        />,
        { className: "fail-toast" }
      );
      return;
    }
    dispatch(setPrevPageName({ pageName: "Adjective" }));
    navigate("/cards-adjective", { state: { adjSort, adjIds } });
  };

  const handleCheckboxChange = (id, isChecked) => {
    setCheckedStates((prev) => ({
      ...prev,
      [id]: isChecked,
    }));
  };

  return (
    <div className="min-h-screen emotional px-5 pt-8 pb-5">
      <AppHeader />
      <p className="font-poppins font-semibold text-white text-2xl text-center pt-5">
        {name}
      </p>
      <p className="font-poppins text-white font-light text-[14px] pt-2.5 pb-[30px] text-center">
        Select up to three situations you’re <br /> currently aware of
      </p>
      <div
        className="overflow-y-auto hide-scrollbar grid grid-cols-2"
        style={{ maxHeight: "calc(100vh - 312px)" }}
      >
        {emotions.map((emotion) => (
          <div
            className={`flex items-center mb-[10px] rounded-[12px] ${
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
            <Checkbox
              checked={checkedStates[emotion.id]}
              onChange={(e) =>
                handleCheckboxChange(emotion.id, e.target.checked)
              }
              checkedIcon={
                <SvgIcon
                  sx={{
                    width: 20, // 👈 match unchecked size
                    height: 20,
                    background: checkedStates[emotion.id]
                      ? "#5847C2"
                      : "yellow",
                    borderRadius: "5px",
                    border: checkedStates[emotion.id]
                      ? "none"
                      : "1px solid white",
                    padding: checkedStates[emotion.id] ? "3px" : "0",
                  }}
                >
                  <CheckIcon
                    sx={{
                      fontSize: 20, // size of the checkmark itself
                      color: checkedStates[emotion.id] ? "white" : "black",
                    }}
                  />
                </SvgIcon>
              }
              icon={
                <SvgIcon
                  sx={{
                    width: 20, // 👈 match unchecked size
                    height: 20,
                    background: "transparent",
                    borderRadius: "5px",
                    border: "1px solid rgba(255, 255, 255, 0.5)",
                  }}
                >
                  <CheckIcon sx={{ fontSize: 20, color: "transparent" }} />
                </SvgIcon>
              }
              sx={{
                padding: 0, // remove default extra padding
                "& .MuiSvgIcon-root": {
                  transition: "color 0.3s ease, background 0.3s ease",
                },
              }}
            />
            <p className="font-poppins text-4 first-letter:uppercase ml-[10px]">
              {emotion.name}
            </p>
          </div>
        ))}
      </div>
      <button
        type="button"
        className="shadow-[inset_0_0_10px_rgba(255,255,255,0.4)] tracking-wide font-poppins font-semibold text-white uppercase mt-5 bg-[#8690FD] rounded-[38px] text-md w-full px-5 py-4 text-center"
        onClick={() => onClickOKBtn()}
      >
        OK
      </button>
      <LoadingModal open={isLoading} />
    </div>
  );
};

export default Emotional;
