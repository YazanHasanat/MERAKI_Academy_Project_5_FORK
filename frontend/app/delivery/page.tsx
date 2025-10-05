"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import UserInfo from "./components/UserInfo";
import PendingOrders from "./components/PendingOrders";
import MyOrders from "./components/MyOrders";
import CompletedOrders from "./components/CompletedOrders";
import { useRouter } from "next/navigation";

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
  const [selected, setSelected] = useState<string>("userinfo");
const router=useRouter()
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
const role=typeof window !== "undefined" && localStorage.getItem("role_id") ? Number(localStorage.getItem("role_id")) : null
  if (role!==3) {
    router.push("/unauthorized")
  }
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f5f5f5" }}>
      <Sidebar selected={selected} onSelect={setSelected} />
      <Box sx={{ flex: 1, p: 4, marginLeft: '220px' }}>
        {selected === "userinfo" && <UserInfo user={user} />}
        {selected === "pending" && (
          <PendingOrders
            orders={orders}
            loadingOrders={loadingOrders}
            handleChangeStatus={handleChangeStatus}
          />
        )}
        {selected === "myorders" && (
          <MyOrders
            orders={orders}
            driverId={user?.id}
            handleChangeStatus={handleChangeStatus}
          />
        )}
        {selected === "completed" && (
          <CompletedOrders orders={orders} driverId={user?.id} />
        )}
      </Box>
    </Box>
  );
}
