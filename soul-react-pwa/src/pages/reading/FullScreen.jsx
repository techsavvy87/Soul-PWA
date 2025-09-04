import { siteBaseUrl } from "../../utils/constants";

const ReadingFullScreen = () => {
  const reading = JSON.parse(window.sessionStorage.getItem("reading"));

  return (
    <div className="full-screen">
      <div className="bg-white p-[10px] relative">
        {reading?.img && (
          <img
            src={siteBaseUrl + "reading/" + reading.img}
            alt={`Reading ${reading.id}`}
            className="w-full"
          />
        )}
        <p className="font-poppins font-bold text-black inline-block  absolute bottom-[5%] left-1/2 -translate-x-1/2 py-[2px] px-6 text-[20px] bg-white text-center">
          {reading?.title}
        </p>
        <p className="font-bold text-black text-[20px] absolute bottom-[4%] w-15 h-15 bg-white rounded-full flex items-center justify-center">
          {reading?.number}
        </p>
      </div>
    </div>
  );
};

export default ReadingFullScreen;
