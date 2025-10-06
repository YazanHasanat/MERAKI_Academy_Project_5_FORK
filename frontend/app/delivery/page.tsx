"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, useMediaQuery, useTheme, IconButton, AppBar, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get("https://meraki-academy-project-5-xtxg.onrender.com/users/mypage", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUser(Array.isArray(res.data) ? res.data[0] : res.data);
      })
      .catch((err) => console.error("User fetch error:", err))
      .finally(() => setLoadingUser(false));

    axios
      .get("https://meraki-academy-project-5-xtxg.onrender.com/orders", {
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
  
  setOrders((prevOrders) =>
    prevOrders.map((order) =>
      order.id === orderId
        ? { ...order, status: newStatus, driver_id: user?.id } 
        : order
    )
  );

  if (newStatus === "on the way") {
    setSelected("myorders");
  }

  try {
    await axios.put(
      "https://meraki-academy-project-5-xtxg.onrender.com/orders/status",
      { order_id: orderId, status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Order status updated successfully on the server.");
  } catch (err) {
    console.error("Error updating status:", err);
  }
};
  const role = typeof window !== "undefined" && localStorage.getItem("role_id") ? Number(localStorage.getItem("role_id")) : null;
  
  if (role !== 3) {
    router.push("/unauthorized");
    return null;
  }

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };


  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f5f5f5" }}>
      {/* Mobile App Bar */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            zIndex: theme.zIndex.drawer + 1, 
            bgcolor: "primary.main",
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Delivery Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Sidebar/Drawer */}
      <Sidebar
        selected={selected}
        onSelect={setSelected}
        open={isMobile ? drawerOpen : true} 
        onClose={handleDrawerToggle}
        variant={isMobile ? "temporary" : "persistent"} 
        isMobile={isMobile}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { md: `calc(100% - 220px)` },
          marginTop: { xs: "56px", md: 0 },
        }}
      >
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