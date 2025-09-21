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


//====================icons================

const CartIcon = ({ size = 24, color = "white" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={color} viewBox="0 0 24 24" width={size} height={size}>
    <path d="M7 18c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zm10 0c-1.104 0-2 .896-2 2s.896 2 2 2 2-.896 2-2-.896-2-2-2zM7.3 14h9.4c.5 0 .9-.36.99-.85l1.57-8.53H5.21l-.94-2H0v2h2l3.6 7.59-1.35 2.45C3.52 15.37 4.48 17 6 17h12v-2H6.42c-.14 0-.25-.11-.25-.25l.03-.12L7.3 14z"/>
  </svg>
);

const AccountIcon = ({ size = 24, color = "white" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={color} viewBox="0 0 24 24" width={size} height={size}>
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
  </svg>
);
//=======================icons=================

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
         <AppBar
            position="fixed"
            sx={{ bgcolor: "#F8BBD0" }} 
          >

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
           <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', position: 'relative', left: '-100px' }}
            >
              Bebek Baby
            </Typography>



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
              <AccountIcon size={28} color="white" />
            </Button>

            <Button color="inherit" onClick={() => setOpenCart(true)}>
              <CartIcon size={28} color="white" />
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
