"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
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
} from "@mui/material";

type CartItem = {
  product_id: number;
  title: string;
  price: number;
  quantity: number;
};

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(true);

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
      } catch {
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
console.log(totalPrice);

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
          pay_method: paymentMethod,
          total_price: totalPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          withCredentials: true, 
        }
      );
      alert("Order placed successfully!");
      setCartItems([]);
      setName("");
      setPhone("");
      setPaymentMethod("cash");
    } catch {
      alert("Failed to place order. Please try again.");
    }
  };

  if (loading) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 6 }}>
        Loading...
      </Typography>
    );
  }

  return (
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
        fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
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
            <Typography color="text.secondary">Your cart is empty.</Typography>
          ) : (
            cartItems.map((item) => (
              <Box
                key={item.product_id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  mb: 2,
                  pb: 2,
                  borderBottom: "1px solid #eee",
                }}
              >
                <Typography>{item.title}</Typography>
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
  );
};

export default CheckoutPage;
