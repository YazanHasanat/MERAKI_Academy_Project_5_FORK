import { Button, Snackbar, Alert } from "@mui/material";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { useState } from "react";

type PaymentPageProps = {
  cartItems: any[];
  totalPrice: number;
  name: string;
  phone: string;
  clientSecret: string;
};

const PaymentPage = ({ cartItems, totalPrice, name, phone, clientSecret }: PaymentPageProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");
const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Error clearing cart:", err);
    } 
  };
  const handlePlaceOrder = async () => {
    if (!stripe || !elements) return;
    setLoading(true);

    const { error } = await stripe.confirmPayment({ elements, confirmParams: { return_url: window.location.href }, redirect: "if_required" });

    if (error) {
      setSnackbarMessage(error.message || "Payment failed");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/orders", {
        products: cartItems.map(({ product_id, quantity }) => ({ product_id, quantity })),
        status: "pending",
        full_name: name,
        pay_method: "card",
        total_price: totalPrice,
      }, { headers: { Authorization: `Bearer ${token}` } });

      setSnackbarMessage("Payment successful! Order placed.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch {
      setSnackbarMessage("Failed to place order. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

    setLoading(false);
    clearCart();
  };

  return (
    <div>
      <PaymentElement />
      <Button variant="contained" size="large" sx={{ mt: 2 }} onClick={handlePlaceOrder} disabled={!clientSecret || loading || !name || !phone || cartItems.length === 0}>
        {loading ? "Processing..." : "Place Order"}
      </Button>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snackbarSeverity}>{snackbarMessage}</Alert>
      </Snackbar>
    </div>
  );
};

export default PaymentPage;
