"use client";

import * as React from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Container from "@mui/material/Container";
import axios from "axios";
import { Category } from "../page";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [openCart, setOpenCart] = React.useState(false);
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
      <AppBar position="static" color="primary">
        <Container>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                minWidth: 120,
              }}
            >
              <Link
                href="/"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Typography variant="h6">Bebek Baby</Typography>
              </Link>
            </Box>
            <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search products..."
                variant="outlined"
                sx={{ bgcolor: "white", borderRadius: 1 }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button color="inherit" component={Link} href="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} href="/register">
                Register
              </Button>
              <Button color="inherit" onClick={() => setOpenCart(true)}>
                Cart
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Box sx={{ bgcolor: "grey.100", py: 1 }}>
        <Container sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          {categories.map((cat) => (
            <Button key={cat.id} component={Link} href={`/category/${cat.id}`}>
              {cat.name}
            </Button>
          ))}
        </Container>
      </Box>
      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </>
  );
}
