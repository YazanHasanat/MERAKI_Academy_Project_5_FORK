"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

type UserType = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  country: string;
  role_id?: string;
};

type OrderType = {
  id: number;
  created_at: string;
  total_price: string;
  status: string;
  full_name: string;
  address: string;
  latitude?: number;
  longitude?: number;
};

export default function DeliveryPage() {
  const [user, setUser] = useState<UserType | null>(null);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const userAvatar = localStorage.getItem("avatar") || "/avatar.png";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

   
    axios
      .get("http://localhost:5000/users/mypage", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(Array.isArray(res.data) ? res.data[0] : res.data);
      })
      .catch((err) => console.error("User fetch error:", err))
      .finally(() => setLoadingUser(false));


    axios
      .get("http://localhost:5000/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const fetchedOrders: OrderType[] = Array.isArray(res.data.orders)
          ? res.data.orders
          : [];

        setOrders(fetchedOrders.filter((o: OrderType) => o.status === "pending"));
      })
      .catch((err) => console.error("Orders fetch error:", err))
      .finally(() => setLoadingOrders(false));
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", py: 5 }}>
      <Stack spacing={3} sx={{ width: 600 }}>
        {/* Driver*/}
        {loadingUser ? (
          <Typography variant="h6" align="center">
            Loading user data...
          </Typography>
        ) : user ? (
          <Card sx={{ borderRadius: 3, boxShadow: 5 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom color="black">
                Personal Info
              </Typography>
              <Typography variant="body2" color="gray" mb={3}>
                Your account information
              </Typography>
              <Stack spacing={2} direction="row" alignItems="center">
                <Avatar src={userAvatar} alt="Profile" sx={{ width: 64, height: 64 }} />
                <Stack spacing={1} flexGrow={1}>
                  <Typography>First Name: {user.firstname}</Typography>
                  <Typography>Last Name: {user.lastname}</Typography>
                  <Typography>Email: {user.email}</Typography>
                  <Typography>Country: {user.country}</Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ) : (
          <Typography variant="h6" align="center">
            No data found
          </Typography>
        )}

        {/* orders*/}
        <Card sx={{ borderRadius: 3, boxShadow: 5 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="black">
              Pending Orders
            </Typography>

            {loadingOrders ? (
              <Typography>Loading</Typography>
            ) : orders.length === 0 ? (
              <Typography>No pending orders</Typography>
            ) : (
              <Stack spacing={2}>
                {orders.map((order: OrderType) => (
                  <Stack key={order.id} direction="row" spacing={2} alignItems="flex-start">
                    <AccessTimeRoundedIcon sx={{ color: "black", mt: 0.5 }} />
                    <Stack spacing={0.5} flexGrow={1}>
                      <Typography variant="body1">
                        Order #{order.id} - <strong>{order.status}</strong>
                      </Typography>
                      <Typography
                        variant="body2"
                        color="primary"
                        sx={{ cursor: "pointer", textDecoration: "underline" }}
                        onClick={() => {
                            if (order.latitude && order.longitude) {
                            window.open(
                                `https://www.google.com/maps?q=${order.latitude},${order.longitude}`,
                                "_blank"
                            );
                            }
                        }}
                        >
                        Address: {order.address}
                        </Typography>
                      <Typography variant="body2" color="gray">
                        Total: ${order.total_price}
                      </Typography>
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
