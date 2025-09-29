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
  Button, 
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

  
  const handleChangeStatus = async (orderId: number, newStatus: string) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "http://localhost:5000/orders/status",
        { order_id: orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", justifyContent: "center", py: 5 }}>
      <Stack spacing={3} sx={{ width: 600 }}>
        {/* Driver*/}
        <Card
        sx={{
          borderRadius: 4,
          boxShadow: 3,
          p: 4,
          backgroundColor: "#ffffff",
          border: "1px solid #ddd",
          width: "100%", 
        }}
      >

        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mb: 3, color: "#222", textAlign: "center" }}
        >
          Driver Information
        </Typography>

        <Stack spacing={2}>
          <Stack direction="row" spacing={4} alignItems="flex-start">
            {/* Avatar */}
            <Avatar
              src={userAvatar}
              alt="Driver Profile"
              sx={{ width: 100, height: 100, border: "1px solid #ccc" }}
            />

            {/* First Name & Last Name */}
            <Stack direction="row" spacing={2} flexGrow={1}>
              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f9f9f9",
                  boxShadow: 1,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#555" }}>
                  First Name:
                </Typography>
                <Typography variant="body1" sx={{ color: "#333" }}>
                  {user?.firstname || "-"}
                </Typography>
              </Box>

              <Box
                sx={{
                  flex: 1,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: "#f9f9f9",
                  boxShadow: 1,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#555" }}>
                  Last Name:
                </Typography>
                <Typography variant="body1" sx={{ color: "#333" }}>
                  {user?.lastname || "-"}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          {/* Email */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#f9f9f9",
              boxShadow: 1,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#555" }}>
              Email:
            </Typography>
            <Typography variant="body1" sx={{ color: "#333" }}>
              {user?.email || "-"}
            </Typography>
          </Box>

          {/* Country */}
          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "#f9f9f9",
              boxShadow: 1,
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#555" }}>
              Country:
            </Typography>
            <Typography variant="body1" sx={{ color: "#333" }}>
              {user?.country || "-"}
            </Typography>
          </Box>
        </Stack>
      </Card>




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

                      {/* status buttons*/}
                      <Stack direction="row" spacing={1} mt={1}>
                        {order.status === "pending" && (
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => handleChangeStatus(order.id, "on the way")}
                          >
                            Mark as On The Way
                          </Button>
                        )}
                        {order.status === "on the way" && (
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleChangeStatus(order.id, "completed")}
                          >
                            Mark as Completed
                          </Button>
                        )}
                      </Stack>
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
