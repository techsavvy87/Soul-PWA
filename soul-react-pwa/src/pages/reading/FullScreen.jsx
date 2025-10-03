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
    <div
      className="relative w-screen"
      style={{ height: "calc(100vh - 150px)" }}
    >
      <div className="flex justify-center">
        {reading?.img && (
          <img
            src={siteBaseUrl + "reading/" + reading.img}
            className="w-auto max-w-[70vw] h-auto mt-5 object-contain"
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
