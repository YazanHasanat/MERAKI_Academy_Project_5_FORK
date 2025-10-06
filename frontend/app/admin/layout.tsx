"use client"
import { useState } from "react";
import { Box, Button, Typography, IconButton, Drawer, useMediaQuery, useTheme } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const role = typeof window !== "undefined" && localStorage.getItem("role_id") ? Number(localStorage.getItem("role_id")) : null;
  
  if (role !== 2) {
    router.push("/unauthorized");
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("firstName");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role_id");
    window.dispatchEvent(new Event("storageUpdate"));
    router.push("/");
  };

  const drawerContent = (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", py: 4, px: 2, height: "100%" }}>
      <Typography variant="h6" mb={2} textAlign="center" color="primary">
        Admin Dashboard
      </Typography>
      <Button sx={{ mb: 1, justifyContent: "flex-start" }} variant="outlined" component={Link} href="/admin/category" onClick={() => isMobile && setMobileOpen(false)}>
        Category info
      </Button>
      <Button sx={{ mb: 1, justifyContent: "flex-start" }} variant="outlined" component={Link} href="/admin/products" onClick={() => isMobile && setMobileOpen(false)}>
        Products info
      </Button>
      <Button sx={{ mb: 1, justifyContent: "flex-start" }} variant="outlined" component={Link} href="/admin/dashboard" onClick={() => isMobile && setMobileOpen(false)}>
        Dashboard
      </Button>
      <Box sx={{ flex: 1 }} />
      <Button sx={{ mt: "auto" }} variant="outlined" color="error" onClick={handleLogout}>
        logout
      </Button>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f5f5f5" }}>
      {/* Mobile menu button */}
      {isMobile && (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ position: "fixed", top: 16, left: 16, zIndex: 1300, bgcolor: "background.paper" }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Sidebar for desktop - restored to original */}
      {!isMobile && (
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
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            zIndex: 1200,
          }}
        >
          <Typography variant="h6" mb={2} textAlign="center" color="primary">
            Admin Dashboard
          </Typography>
          <Button sx={{ mb: 1 }} variant="outlined" component={Link} href="/admin/category">
            Category info
          </Button>
          <Button sx={{ mb: 1 }} variant="outlined" component={Link} href="/admin/products">
            Products info
          </Button>
          <Button sx={{ mb: 1 }} variant="outlined" component={Link} href="/admin/dashboard">
            Dashboard
          </Button>
          <Box sx={{ flex: 1 }} />
          <Button sx={{ mt: "auto" }} variant="outlined" color="error" onClick={handleLogout}>
            logout
          </Button>
        </Box>
      )}

      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={isMobile && mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          marginLeft: { xs: 0, md: "220px" },
          width: { xs: "100%", md: "calc(100% - 220px)" },
        }}
      >
        {/* Add top padding for mobile to account for menu button */}
        {isMobile && <Box sx={{ height: 56 }} />}
        {children}
      </Box>
    </Box>
  );
}