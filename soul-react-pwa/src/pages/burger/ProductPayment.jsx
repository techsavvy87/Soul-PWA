import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { get } from "../../utils/axios";
import { setIsLoading } from "../../redux/appsettingSlice";
import { siteBaseUrl } from "../../utils/constants";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PAYPAL_CLIENT_ID } from "../../utils/constants";
import { post } from "../../utils/axios";
import ToastLayout from "../../components/ToastLayout";
import toast from "react-simple-toasts";

// PayPal Checkout component
const Checkout = ({ amount, productId }) => {
  const createOrder = async () => {
    const url = "/paypal/create-order";
    const res = await post(url, { amount });
    console.log("Order created:", res.data.id);
    return res.data.id; // PayPal order ID
  };

  const onApprove = async (data) => {
    const url = "/paypal/capture-order";
    const res = await post(url, { orderId: data.orderID, productId });

    if (res.data.status === "COMPLETED") {
      // Handle successful payment
      toast(
        <ToastLayout
          message="Payment completed successfully."
          type="success-toast"
        />,
        {
          className: "success-toast",
        }
      );
    } else {
      toast(<ToastLayout message="Payment failed." type="fail-toast" />, {
        className: "fail-toast",
      });
    }
  };

  return <PayPalButtons createOrder={createOrder} onApprove={onApprove} />;
};

const ProductPayment = () => {
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [purchasedStatus, setPurchasedStatus] = useState(false);
  const { type } = location.state || {};
  const hasRendered = useRef(false);

  useEffect(() => {
    if (!hasRendered.current) {
      getProductDetails();
      purchasedCheck();
      hasRendered.current = true;
    }
  }, []);

  // Fetch product details
  const getProductDetails = async () => {
    dispatch(setIsLoading({ isLoading: true }));
    try {
      const result = await get(`/product/detail/${id}`);
      const productData = result.data;
      dispatch(setIsLoading({ isLoading: false }));
      if (productData.status) {
        setProduct(productData.result);
      }
    } catch (error) {
      dispatch(setIsLoading({ isLoading: false }));
    }
  };

  //   Check if user already purchased this product
  const purchasedCheck = async () => {
    const url = `/product/purchased/${id}`;
    try {
      const result = await get(url);
      setPurchasedStatus(result.data.status);
    } catch (error) {
      console.error("Error checking purchase status:", error);
    }
  };

  return (
    <div className="mt-6">
      {product && (
        <div className="rounded-[20px] shadow-[0_4px_4px_0_#00000033] ">
          {/* Product Image */}
          <img
            src={`${siteBaseUrl}store/${product.img}`}
            alt={product.title}
            className="w-full h-40 object-cover rounded-t-[20px]"
          />

          {/* Product Details */}
          <div className="p-5 rounded-b-[20px] border-[1.5px] border-[#ffffff80] border-t-0">
            <div className="flex justify-between items-center pt-2">
              <span className="first-letter:uppercase font-poppins font-semibold text-[14px] bg-blue-100 text-blue-800 text-xs me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300">
                {type}
              </span>
              {purchasedStatus ? (
                <span className="bg-[#B9421A] text-white  text-[14px]  px-[15px] py-[3px] rounded-full font-poppins font-semibold">
                  Purchased
                </span>
              ) : (
                <span className="text-[#c12888] text-[14px] bg-[#fceef7] px-[15px] py-[3px] rounded-full font-poppins font-semibold">
                  ${product.price}
                </span>
              )}
            </div>

            <h2 className="text-2xl text-white mt-4 font-ovo leading-snug">
              {product.title}
            </h2>

            <p className="text-white text-lg mt-2 font-ovo leading-relaxed mb-10">
              {product.description}
            </p>

            {/* PayPal Button Container */}
            {!purchasedStatus && (
              <PayPalScriptProvider
                options={{
                  "client-id": PAYPAL_CLIENT_ID,
                  "disable-funding": "card,credit,paylater",
                }}
              >
                <Checkout amount={product.price} productId={id} />
              </PayPalScriptProvider>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPayment;
