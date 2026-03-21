import API from "../api";

function RazorpayModal({ order, onClose }) {

  const loadScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {

    const loaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!loaded) {
      alert("Razorpay SDK failed");
      return;
    }

    // ✅ Backend se order create
    const { data } = await API.post("/payment/create-order", {
      amount: order.amount,
      orderId: order._id, // admin order ref
    });

    const options = {
      key: "rzp_test_RXG1QPP8Jk082R",
      amount: data.order.amount,
      currency: "INR",
      name: "Admin Panel",
      description: `Order ${order._id}`,
      order_id: data.order.id,

      handler: async function (response) {

        const verify = await API.post(
          "/payment/verify-payment",
          response
        );

        if (verify.data.success) {
          alert("Payment Successful ✅");
          onClose();
        } else {
          alert("Payment Failed ❌");
        }
      },

      theme: { color: "#198754" },
    };

    new window.Razorpay(options).open();
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <h3>Collect Payment</h3>

        <p><b>Order ID:</b> {order._id}</p>
        <p><b>Customer:</b> {order.customer}</p>
        <p><b>Amount:</b> ₹{order.amount}</p>

        <button onClick={handlePayment}>Pay Now</button>
        <button onClick={onClose} style={{ marginLeft: 10 }}>Cancel</button>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.5)",
};

const modal = {
  background: "#fff",
  padding: 20,
  width: 350,
  margin: "100px auto",
  borderRadius: 8,
};

export default RazorpayModal;
