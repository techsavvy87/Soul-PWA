import * as React from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { FaInfo } from "react-icons/fa6";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

export default function InfoModal({ title, description }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <button
        className="w-6 h-6 rounded-full ml-[10px] bg-[#8690FD] flex items-center justify-center text-white"
        onClick={handleClickOpen}
      >
        <FaInfo />
      </button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        BackdropProps={{
          style: { backgroundColor: "transparent" },
        }}
        PaperProps={{
          sx: {
            borderRadius: "20px",
            boxShadow: "0 0 25px rgba(0, 0, 0, 0.25)",
            paddingBottom: "16px",
            background: "#8690FD",
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: "16px 30px 0px",
            color: "white",
            textAlign: "center",
            fontFamily: "Poppins",
          }}
        >
          {title}
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
          })}
        >
          <CancelOutlinedIcon />
        </IconButton>
        <DialogContent
          className="hide-scrollbar"
          sx={{
            color: "white",
            fontFamily: "Poppins",
            marginTop: "-1px",
            maxHeight: "300px",
            paddingBottom: "0px !important",
          }}
        >
          <Typography sx={{ fontFamily: "Poppins" }}>{description}</Typography>
        </DialogContent>
      </BootstrapDialog>
    </React.Fragment>
  );
}
