"use client";

import { Box, Container, Typography, Link, IconButton } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import { useEffect, useState } from "react";

export default function Footer() {
  const [role, setRole] = useState<number | null>(null);

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

  if (role === 2) return null; 

  return (
    <Box
      sx={(theme) => ({
        bgcolor: theme.palette.mode === "light" ? "#F8BBD0" : "#7b1fa2",
        color: theme.palette.mode === "light" ? "black" : "white",
        mt: 0,
        py: 4,
      })}
    >
      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            flexWrap: "wrap",
            mb: 3,
          }}
        >
          {/* Logo + Name */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src="/assets/logo2.png" 
                alt="KiddyJoy Logo"
                sx={{ width: 40, height: 40, objectFit: "contain" }}
              />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                KiddyJoy
              </Typography>
            </Box>
            <Typography variant="body2">
              Your trusted store for baby products.
            </Typography>
          </Box>

          {/* Categories Links */}
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
              mt: { xs: 2, md: 0 },
            }}
          >
            <Link href="/category/1" underline="hover" color="inherit">
              Clothing
            </Link>
            <Link href="/category/2" underline="hover" color="inherit">
              Toys & Games
            </Link>
            <Link href="/category/3" underline="hover" color="inherit">
              Nutrition
            </Link>
            <Link href="/category/4" underline="hover" color="inherit">
              Furniture
            </Link>
            <Link href="/category/5" underline="hover" color="inherit">
              Baby Gear
            </Link>
          </Box>
        </Box>

        {/* Socials + copyright */}
        <Box
          sx={{
            borderTop: "1px solid #e0e0e0",
            pt: 2,
            textAlign: "center",
          }}
        >
          <Box sx={{ mb: 1 }}>
            <IconButton
              href="https://facebook.com"
              target="_blank"
              color="inherit"
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              href="https://instagram.com"
              target="_blank"
              color="inherit"
            >
              <InstagramIcon />
            </IconButton>
            <IconButton
              href="https://twitter.com"
              target="_blank"
              color="inherit"
            >
              <TwitterIcon />
            </IconButton>
          </Box>
          <Typography variant="body2">
            © 2025 Bebek Baby - All Rights Reserved
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
