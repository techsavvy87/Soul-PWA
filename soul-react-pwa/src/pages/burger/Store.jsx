import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-simple-toasts";
import { setIsLoading } from "../../redux/appsettingSlice";
import { get } from "../../utils/axios";
import ToastLayout from "../../components/ToastLayout";
import { siteBaseUrl } from "../../utils/constants";

const Store = () => {
  const [storeItem, setStoreItem] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const productCss = "text-[12px] text-[#5E6BFD]";
  const serviceCss = "text-[12px] text-[#3D9EFF]";
  const { isLoading } = useSelector((state) => state.appsetting);

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
      <p className="font-poppins font-semibold text-white text-2xl text-center">
        Store
      </p>
      <div
        className="flex justify-between flex-wrap mt-2.5 overflow-y-auto overscroll-contain hide-scrollbar"
        style={{ maxHeight: "calc(100vh - 150px)" }}
      >
        {storeItem.length === 0 ? (
          <p className="font-poppins text-center text-2xl pt-[50%]">
            There are no items in the store.
          </p>
        ) : (
          storeItem.map((item, index) => (
            <div
              key={index}
              className="mb-[10px] bg-white rounded-[16px] overflow-hidden w-[48%] shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
              onClick={() =>
                navigate(`/product-payment/${item.id}`, {
                  state: { type: item.type },
                })
              }
            >
              <img
                src={`${siteBaseUrl}store/${item.img}`}
                alt={item.title}
                className="w-full h-[100px] object-cover"
              />
              <div className="p-2">
                <h3 className="text-[17px] font-bold text-gray-800 line-clamp-1 text-ellipsis">
                  {item.title}
                </h3>
                <div className="flex justify-between items-center">
                  <p
                    className={`first-letter:uppercase font-poppins font-semibold text-[14px] ${
                      item.type === "product" ? productCss : serviceCss
                    }`}
                  >
                    {item.type}
                  </p>
                  <span className="text-[#c12888] text-[13px] bg-[#fceef7] px-[15px] py-[3px] rounded-full font-poppins font-semibold">
                    ${item.price}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Store;
