"use client";

import * as React from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { Category } from "../page";

export default function SimpleNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [cartCount, setCartCount] = React.useState(0);

  React.useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get("http://localhost:5000/categories");
        setCategories(
          response.data.map((cat: any) => ({ id: cat.id, name: cat.name }))
        );
      } catch (error) {
        console.error(error);
      }
    }
    fetchCategories();
  }, []);

  React.useEffect(() => {
    // Get cart item count from localStorage
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartCount(cartItems.length);
  }, []);

  return (
    <>
      <AppBar 
        position="sticky" 
        sx={{ 
          bgcolor: "#FFFFFF",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          color: "#333",
          transition: "all 0.3s ease",
          zIndex: 1100
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", py: 1.5 }}>
            {/* Logo + name */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Link 
                href="/" 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  textDecoration: "none",
                  transition: "transform 0.3s ease"
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
              >
                <Box
                  component="img"
                  src="/assets/logo2.png"
                  alt="KiddyJoy Logo"
                  sx={{
                    height: "50px",
                    width: "auto",
                    objectFit: "contain",
                    mr: 2,
                    transition: "all 0.3s ease",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
                  }}
                />
                <Typography
                  variant="h4"
                  sx={{ 
                    fontWeight: "bold", 
                    fontSize: { xs: "1.5rem", sm: "1.8rem", md: "2rem" },
                    background: "linear-gradient(45deg, #EC407A, #F48FB1)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "0.5px"
                  }}
                >
                  KiddyJoy
                </Typography>
              </Link>
            </Box>

            {/* Cart Icon */}
            <IconButton
              color="inherit"
              onClick={() => router.push("/cart")}
              sx={{
                ml: 2,
                bgcolor: "rgba(236, 64, 122, 0.1)",
                color: "#EC407A",
                borderRadius: "12px",
                p: 1.5,
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "rgba(236, 64, 122, 0.2)",
                  transform: "scale(1.1)",
                  boxShadow: "0 4px 12px rgba(236, 64, 122, 0.3)"
                }
              }}
            >
              <Badge 
                badgeContent={cartCount} 
                color="error"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.7rem",
                    height: "18px",
                    minWidth: "18px"
                  }
                }}
              >
                <ShoppingCartIcon sx={{ fontSize: "1.5rem" }} />
              </Badge>
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}