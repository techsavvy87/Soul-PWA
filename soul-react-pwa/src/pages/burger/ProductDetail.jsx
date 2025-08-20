import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PAYPAL_CLIENT_ID } from "../../utils/constants";
import { post } from "../../utils/axios";

const Checkout = () => {
  const createOrder = async () => {
    const url = "/paypal/create-order";
    const res = await post(url, { amount: "15.00" });
    console.log("Order created:", res.data.id);
    return res.data.id; // PayPal order ID
  };

  const onApprove = async (data) => {
    const url = "/paypal/capture-order";
    const res = await post(url, { orderId: data.orderID });
    console.log("Order captured:", res.data);
    alert("Payment successful: " + res.data.status);
  };

  return <PayPalButtons createOrder={createOrder} onApprove={onApprove} />;
};

const ProductDetail = () => {
  return (
    <PayPalScriptProvider
      options={{
        "client-id": PAYPAL_CLIENT_ID,
      }}
    >
      <Checkout />
    </PayPalScriptProvider>
  );
};

export default ProductDetail;
