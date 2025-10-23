import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

export default function Popup({ anchorEl, onClose }) {
  const open = Boolean(anchorEl);
  const id = open ? "upgrade-popover" : undefined;
  const navigate = useNavigate();

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Typography
        sx={{ p: 2, maxWidth: 220, fontFamily: "Poppins" }}
        onClick={() => {
          navigate("/subscription");
        }}
      >
        Upgrade to unlock.
      </Typography>
    </Popover>
  );
}
