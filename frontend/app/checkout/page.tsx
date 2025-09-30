"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import {
  Box,
  Typography,
  Card,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import PaymentPage from "./PaymentPage";

type CartItem = {
  product_id: number;
  title: string;
  price: number;
  quantity: number;
  image_urls: string[];
};

const stripePromise = loadStripe(
  "pk_test_51SCNPFBmIpGo4zeU14PUeoTUDY2fYx36JrBO6L8GYL0l5qnwveyTMyJNqnY6Lhf28JELJuoeg5cIbLRrkUCP6sk20001olS8p1"
);

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(true);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [clientSecret, setClientSecret] = useState("");

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const createPaymentIntent = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/create-payment-intent",
        { amount: Math.round(totalPrice * 100), currency: "usd" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClientSecret(res.data.clientSecret);
    } catch (err) {
      console.error("Error creating payment intent:", err);
      setSnackbarMessage("Payment initialization failed");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    if (paymentMethod === "card") {
      createPaymentIntent();
    }
  }, [paymentMethod]);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCartItems(res.data.products || []);
      } catch {
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);
  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems([]);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };
  const handlePlaceOrderCash = async () => {
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
          full_name: name,
          pay_method: "cash",
          total_price: totalPrice,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.delete("http://localhost:5000/cart/clear", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbarMessage("Order placed successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setCartItems([]);
      setName("");
      setPhone("");
      setPaymentMethod("cash");
      clearCart();
    } catch {
      setSnackbarMessage("Failed to place order. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => setSnackbarOpen(false);

  if (loading)
    return (
      <Typography variant="h6" align="center" sx={{ mt: 6 }}>
        Loading...
      </Typography>
    );

  return (
    <>
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          mt: 6,
          p: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
          borderRadius: 4,
          display: "flex",
          gap: 6,
        }}
      >
        <Card
          sx={{
            flex: 1,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Customer Info
          </Typography>
          <TextField
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
          />

          <Typography variant="h6" mt={2}>
            Payment Method
          </Typography>
          <RadioGroup
            row
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <FormControlLabel value="cash" control={<Radio />} label="Cash" />
            <FormControlLabel
              value="card"
              control={<Radio />}
              label="Credit Card"
            />
          </RadioGroup>

          {paymentMethod === "card" && clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <PaymentPage
                cartItems={cartItems}
                totalPrice={totalPrice}
                name={name}
                phone={phone}
                clientSecret={clientSecret}
              />
            </Elements>
          ) : paymentMethod === "cash" ? (
            <Button
              variant="contained"
              size="large"
              onClick={handlePlaceOrderCash}
              disabled={!name || !phone || cartItems.length === 0}
            >
              Place Order
            </Button>
          ) : null}
        </Card>

        <Card sx={{ flex: 1, p: 4, display: "flex", flexDirection: "column" }}>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Order Summary
          </Typography>
          <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
            {cartItems.length === 0 ? (
              <Typography>Your cart is empty.</Typography>
            ) : (
              cartItems.map((item) => (
                <Box
                  key={item.product_id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mb: 2,
                    pb: 2,
                    borderBottom: "1px solid #eee",
                    gap: 2,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <img
                      src={
                        item.image_urls?.[0]
                          ? item.image_urls[0].startsWith("http") 
                            ? item.image_urls[0]
                            : `/assets/${item.image_urls[0]}`
                          : "/assets/home.png"
                      }
                      alt={item.title}
                      style={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 4,
                      }}
                    />
                    <Typography>{item.title}</Typography>
                  </Box>
                  <Typography>
                    {item.quantity} × ${item.price}
                  </Typography>
                </Box>
              ))
            )}
          </Box>

          <Divider />
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Typography fontWeight="bold">Total:</Typography>
            <Typography fontWeight="bold">${totalPrice.toFixed(2)}</Typography>
          </Box>
        </Card>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CheckoutPage;
