import React, { useEffect } from "react";
import { siteBaseUrl } from "../../utils/constants";
import { useDispatch } from "react-redux";
import { setPrevPageName } from "../../redux/appsettingSlice";

const ReadingFullScreen = () => {
  const reading = JSON.parse(window.sessionStorage.getItem("reading"));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPrevPageName({ pageName: "reading" }));
  }, [dispatch]);

  return (
    <div className="relative w-screen" style={{ height: "calc(100vh - 80px)" }}>
      <div
        className="absolute left-1/2"
        style={{
          top: "40%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {reading?.img && (
          <img
            src={siteBaseUrl + "reading/" + reading.img}
            className="w-auto max-w-[90vw] object-contain"
            style={{
              maxHeight: "calc(100% - 0px)",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ReadingFullScreen;
