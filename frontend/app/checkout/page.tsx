
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
  const [myLocation, setMyLocation] = useState<any>(null);
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
  const [clientSecret, setClientSecret] = useState("");

  const Stripe = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/create-payment-intent",
        {
          amount: totalPrice * 100,
          currency: "usd",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setClientSecret(response.data.clientSecret);
    } catch (err) {
      console.error("Error creating payment intent:", err);
    }
  };
  useEffect(() => {
    if (paymentMethod === "card") {
      Stripe();
    }
  }, [paymentMethod]);

  const getLocationById = async () => {
    try {
      const result = await axios.get("http://localhost:5000/location", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (result.data.location) {
        setMyLocation(result.data.location);
      }
    } catch (err) {
      console.error("Error fetching location:", err);
    }
  };

  useEffect(() => {
    getLocationById();
  }, []);
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/cart", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (res.data.success && res.data.products) {
          setCartItems(res.data.products);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handlePlaceOrder = async () => {
    try {
      await axios.post(
        "http://localhost:5000/orders",
        {
          products: cartItems.map(({ product_id, quantity }) => ({
            product_id,
            quantity,
          })),
          status: "pending",
          location_id: myLocation ? myLocation.id : null,
          full_name: name,
          pay_method: paymentMethod,
          total_price: totalPrice,
          card_info:
            paymentMethod === "card" ? { cardNumber, expiry, cvv } : null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true,
        }
      );
      await axios.delete("http://localhost:5000/cart/clear", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setSnackbarMessage("Order placed successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setCartItems([]);
      setName("");
      setPhone("");
      setPaymentMethod("cash");
      setCardNumber("");
      setExpiry("");
      setCvv("");
    } catch {
      setSnackbarMessage("Failed to place order. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 6 }}>
        Loading...
      </Typography>
    );
  }

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
          fontFamily: `"Segoe UI", Tahoma, Geneva, Verdana, sans-serif`,
        }}
      >
        <Card
          sx={{
            flex: 1,
            p: 4,
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Customer Info
          </Typography>
          <TextField
            label="Full Name"
            variant="outlined"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            sx={{ boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}
          />
          <Typography variant="h6" mt={3} mb={1}>
            Payment Method
          </Typography>
          <RadioGroup
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            row
            sx={{ gap: 3 }}
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
                myLocation={myLocation}
                name={name}
                phone={phone}
                clientSecret={clientSecret}
              />
            </Elements>
          ) : paymentMethod === "cash" ? (
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: "auto", borderRadius: 3 }}
              onClick={handlePlaceOrder}
              disabled={!name || !phone || cartItems.length === 0}
            >
              Place Order
            </Button>
          ) : null}
        </Card>
        <Card
          sx={{
            flex: 1,
            p: 4,
            boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
            borderRadius: 4,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Order Summary
          </Typography>
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              mb: 3,
            }}
          >
            {cartItems.length === 0 ? (
              <Typography color="text.secondary">
                Your cart is empty.
              </Typography>
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
                      src={`/assets/${item.image_urls[0]}`}
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
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography fontWeight="bold" fontSize={18}>
              Total:
            </Typography>
            <Typography fontWeight="bold" fontSize={18}>
              ${totalPrice.toFixed(2)}
            </Typography>
          </Box>
        </Card>
      </Box>

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
    </>
  );
};

export default CheckoutPage; 