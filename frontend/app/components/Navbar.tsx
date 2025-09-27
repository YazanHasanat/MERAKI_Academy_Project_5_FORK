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
import IconButton from "@mui/material/IconButton";
import axios from "axios";
import { Category } from "../page";
import CartDrawer from "./CartDrawer";
import { useRouter } from "next/navigation";

// ==== MUI Icons ====
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

// ===== I Theme  =====
import { useThemeToggle } from "./Theme";

export default function Navbar() {
  const router = useRouter();
  const toggleTheme = useThemeToggle();

  const [firstName, setFirstName] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [openCart, setOpenCart] = React.useState(false);

  React.useEffect(() => {
    const storedFirstName = localStorage.getItem("firstName");
    const storedUserId = localStorage.getItem("userId");
    setFirstName(storedFirstName);
    setUserId(storedUserId);

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
    const loadUser = () => {
      setFirstName(localStorage.getItem("firstName"));
      setUserId(localStorage.getItem("userId"));
    };
    loadUser();
    window.addEventListener("storageUpdate", loadUser);
    return () => window.removeEventListener("storageUpdate", loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("firstName");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role_id");
    setFirstName(null);
    setUserId(null);
    router.push("/");
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={(theme) => ({
          bgcolor: theme.palette.mode === "light" ? "#F8BBD0" : "#6a1b9a",
        })}
      >
        <Container>
          <Toolbar sx={{ justifyContent: "space-between" }}>
            {/* Logo */}
            <Box sx={{ display: "flex", justifyContent: "flex-start", minWidth: 120 }}>
              <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "bold", ml: -8, fontSize: "2rem" }}
                >
                  Bebek Baby
                </Typography>
              </Link>
            </Box>

            {/* Search bar */}
            <Box sx={{ flexGrow: 1, maxWidth: 400, mx: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search products..."
                variant="outlined"
                sx={(theme) => ({
                  bgcolor: theme.palette.mode === "light" ? "white" : "#424242",
                  borderRadius: 1,
                })}
              />
            </Box>

            {/* User section + Theme Toggle */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {firstName ? (
                <>
                  <Typography
                    variant="h6"
                    sx={{
                      flexGrow: 0,
                      fontSize: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      cursor: "pointer",
                    }}
                    onClick={() => router.push(`/user/${userId}`)}
                  >
                    <AccountCircleIcon />
                    Hi, {firstName}
                  </Typography>
                  <IconButton color="inherit" onClick={handleLogout}>
                    <LogoutIcon />
                  </IconButton>
                </>
              ) : (
                <IconButton color="inherit" component={Link} href="/login">
                  <LoginIcon />
                </IconButton>
              )}

              {/* Cart */}
              <IconButton color="inherit" onClick={() => setOpenCart(true)}>
                <ShoppingCartIcon />
              </IconButton>

              {/* Theme Toggle Button */}
              <IconButton color="inherit" onClick={toggleTheme}>
                <DarkModeIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Categories */}
      <Box
        sx={(theme) => ({
          mt: 8.1,
          bgcolor: theme.palette.mode === "light" ? "#ffffffff" : "#424242",
          py: 1,
        })}
      >
        <Container sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              component={Link}
              href={`/category/${cat.id}`}
              variant="contained"
              sx={(theme) => ({
                bgcolor: theme.palette.mode === "light" ? "#F48FB1" : "#AD1457",
                color: "white",
                borderRadius: "20px",
                textTransform: "none",
                "&:hover": {
                  bgcolor: theme.palette.mode === "light" ? "#EC407A" : "#880E4F",
                },
              })}
            >
              {cat.name}
            </Button>
          ))}
        </Container>
      </Box>

      {/* Cart Drawer */}
      <CartDrawer open={openCart} onClose={() => setOpenCart(false)} />
    </>
  );
}
