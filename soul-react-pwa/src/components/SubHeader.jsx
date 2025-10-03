import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SubHeader = ({ pageName, textColor, pageCss, divCss }) => {
  const theme = createTheme();
  const navigate = useNavigate();

  return (
    <div
      className="flex items-center justify-center relative"
      style={{ color: textColor, ...divCss }}
    >
      <ThemeProvider theme={theme}>
        <ArrowBackIcon
          className="!w-[35px] !h-[35px] absolute left-[3%] z-50 cursor-pointer"
          onClick={() => navigate(-1)}
        />
      </ThemeProvider>
      <p
        className="font-poppins font-semibold text-2xl text-center py-3"
        style={{ ...pageCss }}
      >
        {pageName}
      </p>
    </div>
  );
};
export default SubHeader;
