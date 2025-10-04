"use client";

import { Box, Container, Typography, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const [role, setRole] = useState<number | null>(null);
  const pathname = usePathname();
  
  useEffect(() => {
    const storedRole = localStorage.getItem("role_id");
    setRole(storedRole ? Number(storedRole) : null);

    const handleStorageUpdate = () => {
      const updatedRole = localStorage.getItem("role_id");
      setRole(updatedRole ? Number(updatedRole) : null);
    };

    window.addEventListener("storageUpdate", handleStorageUpdate);
    return () => {
      window.removeEventListener("storageUpdate", handleStorageUpdate);
    };
  }, []);

  if (role === 2 || role === 3 || pathname.startsWith("/unauthorized"))
    return null;

  return (
    <Box
      sx={{
        bgcolor: "#ffffff",
        color: "#333333",
        mt: 0,
        py: 5,
        borderTop: "1px solid #f0f0f0",
        boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            mb: 4,
            gap: 3,
          }}
        >
          {/* Logo + Name */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1, minWidth: { xs: "100%", md: "250px" } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src="/assets/logo2.png"
                alt="KiddyJoy Logo"
                sx={{ width: 50, height: 50, objectFit: "contain" }}
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: "bold",
                  background: "linear-gradient(45deg, #EC407A, #7E57C2)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                KiddyJoy
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Your trusted store for premium baby products. We're committed to providing the best for your little ones.
            </Typography>
            
            {/* Social Icons */}
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <IconButton
                href="https://facebook.com"
                target="_blank"
                sx={{
                  bgcolor: "rgba(236, 64, 122, 0.1)",
                  color: "#EC407A",
                  "&:hover": {
                    bgcolor: "#EC407A",
                    color: "white",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                href="https://instagram.com"
                target="_blank"
                sx={{
                  bgcolor: "rgba(236, 64, 122, 0.1)",
                  color: "#EC407A",
                  "&:hover": {
                    bgcolor: "#EC407A",
                    color: "white",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                href="https://twitter.com"
                target="_blank"
                sx={{
                  bgcolor: "rgba(236, 64, 122, 0.1)",
                  color: "#EC407A",
                  "&:hover": {
                    bgcolor: "#EC407A",
                    color: "white",
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <TwitterIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Categories Links */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: { xs: "100%", sm: "200px" } }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#EC407A" }}>
              Categories
            </Typography>
            <Link 
              href="/category/1" 
              underline="none" 
              color="inherit"
              sx={{
                color: "#555",
                position: "relative",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#EC407A",
                  pl: 1,
                },
                "&:after": {
                  content: '""',
                  position: "absolute",
                  width: 0,
                  height: "1px",
                  bottom: 0,
                  left: 0,
                  bgcolor: "#EC407A",
                  transition: "width 0.3s ease",
                },
                "&:hover:after": {
                  width: "100%",
                },
              }}
            >
              Clothing
            </Link>
            <Link 
              href="/category/2" 
              underline="none" 
              color="inherit"
              sx={{
                color: "#555",
                position: "relative",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#EC407A",
                  pl: 1,
                },
                "&:after": {
                  content: '""',
                  position: "absolute",
                  width: 0,
                  height: "1px",
                  bottom: 0,
                  left: 0,
                  bgcolor: "#EC407A",
                  transition: "width 0.3s ease",
                },
                "&:hover:after": {
                  width: "100%",
                },
              }}
            >
              Toys & Games
            </Link>
            <Link 
              href="/category/3" 
              underline="none" 
              color="inherit"
              sx={{
                color: "#555",
                position: "relative",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#EC407A",
                  pl: 1,
                },
                "&:after": {
                  content: '""',
                  position: "absolute",
                  width: 0,
                  height: "1px",
                  bottom: 0,
                  left: 0,
                  bgcolor: "#EC407A",
                  transition: "width 0.3s ease",
                },
                "&:hover:after": {
                  width: "100%",
                },
              }}
            >
              Nutrition
            </Link>
            <Link 
              href="/category/4" 
              underline="none" 
              color="inherit"
              sx={{
                color: "#555",
                position: "relative",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#EC407A",
                  pl: 1,
                },
                "&:after": {
                  content: '""',
                  position: "absolute",
                  width: 0,
                  height: "1px",
                  bottom: 0,
                  left: 0,
                  bgcolor: "#EC407A",
                  transition: "width 0.3s ease",
                },
                "&:hover:after": {
                  width: "100%",
                },
              }}
            >
              Furniture
            </Link>
            <Link 
              href="/category/5" 
              underline="none" 
              color="inherit"
              sx={{
                color: "#555",
                position: "relative",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#EC407A",
                  pl: 1,
                },
                "&:after": {
                  content: '""',
                  position: "absolute",
                  width: 0,
                  height: "1px",
                  bottom: 0,
                  left: 0,
                  bgcolor: "#EC407A",
                  transition: "width 0.3s ease",
                },
                "&:hover:after": {
                  width: "100%",
                },
              }}
            >
              Baby Gear
            </Link>
          </Box>

          {/* Company Links */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: { xs: "100%", sm: "200px" } }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#EC407A" }}>
              Company
            </Typography>
            <Link 
              href="/about" 
              underline="none" 
              color="inherit"
              sx={{
                color: "#555",
                position: "relative",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#EC407A",
                  pl: 1,
                },
                "&:after": {
                  content: '""',
                  position: "absolute",
                  width: 0,
                  height: "1px",
                  bottom: 0,
                  left: 0,
                  bgcolor: "#EC407A",
                  transition: "width 0.3s ease",
                },
                "&:hover:after": {
                  width: "100%",
                },
              }}
            >
              About Us
            </Link>
            <Link 
              href="/contactus" 
              underline="none" 
              color="inherit"
              sx={{
                color: "#555",
                position: "relative",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#EC407A",
                  pl: 1,
                },
                "&:after": {
                  content: '""',
                  position: "absolute",
                  width: 0,
                  height: "1px",
                  bottom: 0,
                  left: 0,
                  bgcolor: "#EC407A",
                  transition: "width 0.3s ease",
                },
                "&:hover:after": {
                  width: "100%",
                },
              }}
            >
              Contact Us
            </Link>
            <Link 
              href="/privacy" 
              underline="none" 
              color="inherit"
              sx={{
                color: "#555",
                position: "relative",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#EC407A",
                  pl: 1,
                },
                "&:after": {
                  content: '""',
                  position: "absolute",
                  width: 0,
                  height: "1px",
                  bottom: 0,
                  left: 0,
                  bgcolor: "#EC407A",
                  transition: "width 0.3s ease",
                },
                "&:hover:after": {
                  width: "100%",
                },
              }}
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              underline="none" 
              color="inherit"
              sx={{
                color: "#555",
                position: "relative",
                transition: "all 0.3s ease",
                "&:hover": {
                  color: "#EC407A",
                  pl: 1,
                },
                "&:after": {
                  content: '""',
                  position: "absolute",
                  width: 0,
                  height: "1px",
                  bottom: 0,
                  left: 0,
                  bgcolor: "#EC407A",
                  transition: "width 0.3s ease",
                },
                "&:hover:after": {
                  width: "100%",
                },
              }}
            >
              Terms of Service
            </Link>
          </Box>

          {/* Newsletter */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, minWidth: { xs: "100%", md: "250px" } }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#EC407A" }}>
              Subscribe to our Newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              Get the latest updates on new products and special offers.
            </Typography>
            <Box component="form" sx={{ display: "flex", gap: 1 }}>
              <input
                type="email"
                placeholder="Your email"
                style={{
                  flex: 1,
                  padding: "10px 15px",
                  border: "1px solid #e0e0e0",
                  borderRadius: "20px",
                  fontSize: "14px",
                  outline: "none",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#EC407A",
                  color: "white",
                  border: "none",
                  borderRadius: "20px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "all 0.3s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#D81B60";
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#EC407A";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Subscribe
              </button>
            </Box>
          </Box>
        </Box>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: "1px solid #f0f0f0",
            pt: 3,
            textAlign: "center",
          }}
        >
          <Typography variant="body2" sx={{ color: "#666" }}>
            © 2025 KiddyJoy - All Rights Reserved
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}