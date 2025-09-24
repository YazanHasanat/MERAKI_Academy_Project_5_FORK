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

interface Product {
  id: number;
  title: string;
  description?: string;
  image_urls: string[];
  category_id?: number;
  price: number;
  user_id: number;
  is_feature: boolean;
  created_at: Date;
  is_deleted: number;
}

export default function Navbar() {
  const router = useRouter();
//search
  const [product, setProducts] = React.useState <Product[]>([])
  const [search, setSearch] = React.useState("")

  //  useState instead of reading directly from localStorage
  const [firstName, setFirstName] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [openCart, setOpenCart] = React.useState(false);

  React.useEffect(() => {
    // Load from localStorage when component mounts
    const storedFirstName = localStorage.getItem("firstName");
    const storedUserId = localStorage.getItem("userId");
    setFirstName(storedFirstName);
    setUserId(storedUserId);
  
    // Fetch categories
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

  return () => {
    window.removeEventListener("storageUpdate", loadUser);
  };
}, []);
  const getPrcucts = async () => {
    const results = await axios.get("http://localhost:5000/products");
    setProducts(results.data.products)
  }
  React.useEffect(()=>{
    getPrcucts()
  },[])
  
 const filteredProducts = product.filter((pro) =>
  pro.title.toLowerCase().includes(search.toLowerCase())
);

  const handleLogout = () => {
    localStorage.removeItem("firstName");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role_id");
    setFirstName(null);
    setUserId(null);
    router.push("/"); // redirect to home page
  };

  return (
    <>
      <AppBar position="fixed" sx={{ bgcolor: "#F8BBD0" }}>
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
           <Box sx={{ position: "relative", flexGrow: 1, maxWidth: 400, mx: 4 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search products..."
              variant="outlined"
              sx={{ bgcolor: "white", borderRadius: 1 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* Dropdown */}
            {search && filteredProducts.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  bgcolor: "white",          
                  border: "1px solid #ccc",
                  borderRadius: 1,
                  mt: 0.5,
                  zIndex: 10,
                  maxHeight: 250,
                  overflowY: "auto",
                  boxShadow: "0px 4px 6px rgba(0,0,0,0.1)", 
                }}
              >
                {filteredProducts.map((pro) => (
                  <Box
                    key={pro.id}
                    sx={{
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      "&:hover": { bgcolor: "#fce4ec" }, 
                    }}
                    onClick={() => {
                      router.push(`/product/${pro.id}`);
                      setSearch("");
                    }}
                  >
                    <Typography variant="body2" sx={{ color: "black" }}>
                      {pro.title}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          
            {/* User section */}
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
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Categories */}
      <Box sx={{ mt: 8.1, bgcolor: "#ffffffff", py: 1 }}>
        <Container sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
          {categories.map((cat) => (
            <Button
              key={cat.id}
              component={Link}
              href={`/category/${cat.id}`}
              variant="contained"
              sx={{
                bgcolor: "#F48FB1",
                color: "white",
                borderRadius: "20px",
                textTransform: "none",
                "&:hover": { bgcolor: "#EC407A" },
              }}
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
