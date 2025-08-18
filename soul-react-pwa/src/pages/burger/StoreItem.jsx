import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-simple-toasts";
import { setIsLoading } from "../../redux/appsettingSlice";
import { get } from "../../utils/axios";
import ToastLayout from "../../components/ToastLayout";
import { siteBaseUrl } from "../../utils/constants";

const StoreItem = () => {
  const [storeItem, setStoreItem] = useState([]);

  const dispatch = useDispatch();
  const productCss =
    "text-[12px] text-[#4dc187] bg-[#0c272b] border border-[#0c272b] px-2 py-1 rounded-[6px]";
  const serviceCss =
    "text-[12px] text-[#eab764] bg-[#282625] border border-[#282625] px-2 py-1 rounded-[6px]";

  useEffect(() => {
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
      console.log(err);

      toast(<ToastLayout message="Something went wrong." type="fail-toast" />, {
        className: "fail-toast",
      });
      return;
    }
  };
  return (
    <div>
      <p className="font-poppins font-semibold text-white text-2xl text-center pt-5 pb-5">
        Store
      </p>
      <div className="flex justify-between flex-wrap mt-10">
        {storeItem.map((item, index) => (
          <div
            key={index}
            className="mb-4 bg-white rounded-[16px] overflow-hidden w-[48%] shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
          >
            <img
              src={`${siteBaseUrl}store/${item.img}`}
              alt={item.title}
              className="w-full h-[120px] object-cover"
            />
            <div className="p-4">
              <h3 className="text-[14px] font-bold text-gray-800 mb-2">
                {item.title}
              </h3>
              <p className="text-[12px] text-gray-500 leading-[1.4] mb-[10px] line-clamp-4">
                {item.description}
              </p>
              <div className="flex justify-between items-center">
                <p
                  className={`first-letter:uppercase text-base text-right ${
                    item.type === "product" ? productCss : serviceCss
                  }`}
                >
                  {item.type}
                </p>
                <p className="text-base font-bold text-black text-right text-[14px]">
                  ${item.price}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreItem;
