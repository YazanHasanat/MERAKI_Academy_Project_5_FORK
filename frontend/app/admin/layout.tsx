"use client"
import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router =useRouter()
  const role=typeof window !== "undefined" && localStorage.getItem("role_id") ? Number(localStorage.getItem("role_id")) : null
  if (role!==2) {
    router.push("/unauthorized")
  }
  const handleLogout = () => {
    localStorage.removeItem("firstName");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role_id");
    localStorage.removeItem("avatar");
    setTimeout(() => {
      window.location.reload()
      
    }, 200);
    router.push("/"); 
  };
  
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f5f5f5" }}>
      <Box
        sx={{
          width: 220,
          background: "#fff",
          boxShadow: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          py: 4,
          px: 2,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        <Typography variant="h6" mb={2} textAlign="center" color="primary">
          Admin Dashboard
        </Typography>
        <Button sx={{ mb: 1 }} variant="outlined" component={Link} href="/admin/category">Category info</Button>
        <Button sx={{ mb: 1 }} variant="outlined" component={Link} href="/admin/products">Products info</Button>
        <Button sx={{ mb: 1 }} variant="outlined" component={Link} href="/admin/dashboard">Dashboard</Button>
        <Box sx={{ flex: 1 }} />
        <Button sx={{ mt: "auto" }} variant="outlined" color="error" onClick={handleLogout}>logout</Button>
      </Box>
      <Box sx={{ flex: 1, p: 4 }}>
        {children}
      </Box>
    </Box>
  );
}
