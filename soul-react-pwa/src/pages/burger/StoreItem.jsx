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
  const productCss = "text-[12px] text-[#4dc187] font-bold";
  const serviceCss = "text-[12px] text-[#eab764] font-bold";

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
      <p className="font-poppins font-semibold text-white text-2xl text-center pt-5">
        Store
      </p>
      <div className="flex justify-between flex-wrap mt-5">
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
                <span className="bg-red-100 text-red-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300">
                  ${item.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreItem;
