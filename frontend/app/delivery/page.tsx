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
  Divider,
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

        setOrders(fetchedOrders);
      })
      .catch((err) => console.error("Orders fetch error:", err))
      .finally(() => setLoadingOrders(false));
  }, []);

  const handleChangeStatus = async (orderId: number, newStatus: string) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        "http://localhost:5000/orders/status",
        { order_id: orderId, status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: res.data.order.status } : o
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e6ebf1 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        py: 5,
      }}
    >
      {/* عنوان الصفحة */}
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          mb: 4,
          color: "#333",
          textAlign: "center",
          letterSpacing: 1,
        }}
      >
        🚚 Delivery Dashboard
      </Typography>

      <Stack spacing={4} sx={{ width: "90%", maxWidth: "900px" }}>
        {/* Driver Card */}
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: 4,
            p: 4,
            backgroundColor: "#fff",
            border: "1px solid #ddd",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              mb: 3,
              color: "#1976d2",
              textAlign: "center",
            }}
          >
            Driver Information
          </Typography>

          <Stack spacing={3} alignItems="center">
            {/* Avatar */}
            <Avatar
              src={userAvatar}
              alt="Driver Profile"
              sx={{
                width: 120,
                height: 120,
                border: "3px solid #1976d2",
              }}
            />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
              width="100%"
            >
              <Box sx={{ flex: 1, p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  First Name
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {user?.firstname || "-"}
                </Typography>
              </Box>

              <Box sx={{ flex: 1, p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Name
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {user?.lastname || "-"}
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ width: "100%" }} />

            <Box
              sx={{ width: "100%", p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{user?.email || "-"}</Typography>
            </Box>

            <Box
              sx={{ width: "100%", p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Country
              </Typography>
              <Typography variant="body1">{user?.country || "-"}</Typography>
            </Box>
          </Stack>
        </Card>

        {/* Orders Card */}
        <Card sx={{ borderRadius: 3, boxShadow: 5 }}>
          <CardContent>
            <Typography
              variant="h5"
              gutterBottom
              sx={{ fontWeight: "bold", color: "#333" }}
            >
              📦 Pending / On The Way Orders
            </Typography>

            {loadingOrders ? (
              <Typography>Loading...</Typography>
            ) : orders.length === 0 ? (
              <Typography>No pending orders</Typography>
            ) : (
              <Stack spacing={2}>
                {orders
                  .filter((o) => o.status !== "completed") // عرض بس pending + on the way
                  .map((order: OrderType) => (
                    <Card
                      key={order.id}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid #eee",
                        bgcolor: "#fafafa",
                      }}
                    >
                      <Stack
                        direction="row"
                        spacing={2}
                        alignItems="flex-start"
                      >
                        <AccessTimeRoundedIcon
                          sx={{
                            mt: 0.5,
                            color:
                              order.status === "pending"
                                ? "#1976d2"
                                : "#ff9800", // لون حسب الحالة
                          }}
                        />
                        <Stack spacing={1} flexGrow={1}>
                          <Typography variant="body1">
                            Order #{order.id} -{" "}
                            <strong
                              style={{
                                color:
                                  order.status === "pending"
                                    ? "#1976d2"
                                    : "#ff9800",
                              }}
                            >
                              {order.status}
                            </strong>
                          </Typography>
                          <Typography
                            variant="body2"
                            color="primary"
                            sx={{
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
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

                          {/* Status Buttons */}
                          <Stack direction="row" spacing={1} mt={1}>
                            {order.status === "pending" && (
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() =>
                                  handleChangeStatus(order.id, "on the way")
                                }
                              >
                                Mark as On The Way
                              </Button>
                            )}
                            {order.status === "on the way" && (
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                onClick={() =>
                                  handleChangeStatus(order.id, "completed")
                                }
                              >
                                Mark as Completed
                              </Button>
                            )}
                          </Stack>
                        </Stack>
                      </Stack>
                    </Card>
                  ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
