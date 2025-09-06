import { siteBaseUrl } from "../../utils/constants";

const ReadingFullScreen = () => {
  const reading = JSON.parse(window.sessionStorage.getItem("reading"));

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
