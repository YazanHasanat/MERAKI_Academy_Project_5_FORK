"use client";

import * as React from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import { Category } from "../page";

export default function SimpleNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [categories, setCategories] = React.useState<Category[]>([]);

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

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#F8BBD0" }}>
        <Container>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Logo + name */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src="/assets/logo2.png"
                alt="KiddyJoy Logo"
                sx={{
                  height: "2.6rem",
                  width: "auto",
                  objectFit: "contain",
                }}
              />
              <Link
                href="/"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", fontSize: "2rem" }}
                >
                  KiddyJoy
                </Typography>
              </Link>
            </Box>

            {/* Cart Icon */}
            <IconButton
              color="inherit"
              onClick={() => router.push("/cart")}
              sx={{ ml: 2 }}
            >
              <ShoppingCartIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
