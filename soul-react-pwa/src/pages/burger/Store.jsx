import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-simple-toasts";
import { setIsLoading } from "../../redux/appsettingSlice";
import { get } from "../../utils/axios";
import ToastLayout from "../../components/ToastLayout";
import { siteBaseUrl } from "../../utils/constants";
import SubHeader from "../../components/SubHeader";

const Store = () => {
  const [storeItem, setStoreItem] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const renderStatus = useRef(false);
  const { isLoading } = useSelector((state) => state.appsetting);

  useEffect(() => {
    if (renderStatus.current) return;
    renderStatus.current = true;
    getStoreItems();
  }, []);

  const getStoreItems = async () => {
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const result = await get("/list-store");
      const resResult = result.data;
      dispatch(setIsLoading({ isLoading: false }));
      if (resResult.status) {
        setStoreItem(resResult.result);
      }
    } catch (err) {
      dispatch(setIsLoading({ isLoading: false }));

      toast(<ToastLayout message="Something went wrong." type="fail-toast" />, {
        className: "fail-toast",
      });
      return;
    }
  };

  // Don't render until API finishes
  if (isLoading) {
    return null; // or return <Spinner /> if you want a loader
  }
  return (
    <div>
      <SubHeader pageName="Store" textColor="white" />
      <div
        className="flex justify-between flex-wrap mt-2.5 overflow-y-auto overscroll-contain hide-scrollbar"
        style={{ maxHeight: "calc(100vh - 226px)" }}
      >
        {storeItem.length === 0 ? (
          <p className="font-poppins text-center text-2xl pt-[50%]">
            There are no items in the store.
          </p>
        ) : (
          storeItem.map((item, index) => (
            <div
              key={index}
              className="mb-[10px] px-3 py-4 bg-white rounded-[16px] w-full shadow-[0_4px_20px_rgba(0,0,0,0.1)] flex justify-between items-center"
              onClick={() => {
                if (item.type === "service") {
                  window.open(
                    "https://www.paulwagner.com/intuitive-psychic-readings/",
                    "_blank"
                  );
                } else {
                  window.localStorage.setItem("storeType", item.type);
                  navigate(`/product-payment/${item.id}`);
                }
              }}
            >
              <img
                src={`${siteBaseUrl}store/${item.img}`}
                alt={item.title}
                className="min-w-[100px] h-[100px] object-cover"
              />
              <div className="pl-3">
                <h3 className="text-[17px] font-bold text-gray-800 text-center">
                  {item.title}
                </h3>

                <p className="font-poppins text-[14px] leading-[20px]">
                  {item.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      <p className="font-poppins text-[16px] leading-[20px] text-white text-center pt-[10px]">
        For International Orders (outside US), <br /> please email
        paul@paulwagner.com
      </p>
    </div>
  );
};

export default Store;
