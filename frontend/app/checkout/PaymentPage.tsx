import { Button, Snackbar, Alert } from "@mui/material";
import { PaymentElement } from "@stripe/react-stripe-js";
import axios from "axios";
import { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

type PaymentPageProps = {
  cartItems: any[];
  totalPrice: number;
  myLocation: any;
  name: string;
  phone: string;
  clientSecret: string;
};

const PaymentPage = ({
  cartItems,
  totalPrice,
  myLocation,
  name,
  phone,
  clientSecret,
}: PaymentPageProps) => {
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  const stripe = useStripe();
  const elements = useElements();

  const handlePlaceOrder = async () => {
    if (!stripe || !elements) return;

    setLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: "if_required",
    });

    if (error) {
      console.error(error.message);
      setSnackbarMessage(error.message || "Payment failed");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/orders",
        {
          products: cartItems.map(({ product_id, quantity }) => ({
            product_id,
            quantity,
          })),
          status: "pending",
          location_id: myLocation?.id || null,
          full_name: name,
          pay_method: "card",
          total_price: totalPrice,
        },
        token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
      );

      setSnackbarMessage("Payment successful! Order placed.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to place order. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

    setLoading(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <PaymentElement />
      <br />
      <Button
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: "auto", borderRadius: 3 }}
        onClick={handlePlaceOrder}
        disabled={!name || !phone || cartItems.length === 0 || !clientSecret || loading}
      >
        {loading ? "Processing..." : "Place Order"}
      </Button>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default PaymentPage;
