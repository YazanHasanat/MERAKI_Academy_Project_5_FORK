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
import InputAdornment from "@mui/material/InputAdornment";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import axios from "axios";
import { Category } from "../page";
import CartDrawer from "./CartDrawer";
import { usePathname, useRouter } from "next/navigation";

// ==== MUI Icons ====
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import SimpleNavbar from "./NavBarCheck";

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
  const pathname = usePathname();

  //search
  const [product, setProducts] = React.useState<Product[]>([]);
  const [search, setSearch] = React.useState("");
  const [searchFocused, setSearchFocused] = React.useState(false);

  //  useState instead of reading directly from localStorage
  const [firstName, setFirstName] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [openCart, setOpenCart] = React.useState(false);
  const [cartItemCount, setCartItemCount] = React.useState(0);

  React.useEffect(() => {
    // Load from localStorage when component mounts
    const storedFirstName = localStorage.getItem("firstName");
    const storedUserId = localStorage.getItem("userId");
    setFirstName(storedFirstName);
    setUserId(storedUserId);

    // Get cart item count
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    setCartItemCount(cartItems.length);

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
      
      // Update cart count when storage changes
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartItemCount(cartItems.length);
    };

    loadUser();

    window.addEventListener("storageUpdate", loadUser);

    return () => {
      window.removeEventListener("storageUpdate", loadUser);
    };
  }, []);

  const getPrcucts = async () => {
    const results = await axios.get("http://localhost:5000/products");
    setProducts(results.data.products);
  };
  
  React.useEffect(() => {
    getPrcucts();
  }, []);

  const filteredProducts = product.filter((pro) =>
    pro.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("firstName");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role_id");
    localStorage.removeItem("avatar");

    setFirstName(null);
    setUserId(null);
    handleCloseUserMenu();
    router.push("/");
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const role =
    typeof window !== "undefined" && localStorage.getItem("role_id")
      ? Number(localStorage.getItem("role_id"))
      : null;
  if (role == 2 || role == 3 || pathname.startsWith("/unauthorized"))
    return <div></div>;
  if (pathname.startsWith("/checkout")) return <SimpleNavbar />;

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: "#ffffff",
          color: "#333333",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          transition: "all 0.3s ease",
          zIndex: 1100
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "space-between", py: 1 }}>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                component="img"
                src="/assets/logo2.png"
                alt="Bebek Baby Logo"
                sx={{
                  height: "2.5rem",
                  width: "auto",
                  objectFit: "contain",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)"
                  }
                }}
              />
              <Link
                href="/"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <Typography
                  variant="h4"
                  sx={{ 
                    fontWeight: "bold", 
                    fontSize: "1.8rem",
                    background: "linear-gradient(45deg, #EC407A, #7E57C2)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text"
                  }}
                >
                  KiddyJoy
                </Typography>
              </Link>
            </Box>

            {/* Search bar - Desktop */}
            <Box
              sx={{ 
                position: "relative", 
                flexGrow: 1, 
                maxWidth: 450, 
                mx: 4,
                display: { xs: "none", md: "block" }
              }}
            >
              <TextField
                fullWidth
                size="small"
                placeholder="Search for products..."
                variant="outlined"
                sx={{ 
                  bgcolor: "#f5f5f5", 
                  borderRadius: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                    transition: "all 0.3s ease",
                    "& fieldset": {
                      borderColor: "transparent",
                    },
                    "&:hover fieldset": {
                      borderColor: "#EC407A",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#EC407A",
                      boxShadow: "0 0 0 2px rgba(236, 64, 122, 0.2)",
                    },
                  },
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#EC407A" }} />
                    </InputAdornment>
                  ),
                  endAdornment: search && (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={() => setSearch("")}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Dropdown */}
              {(search || searchFocused) && filteredProducts.length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    right: 0,
                    bgcolor: "white",
                    borderRadius: 2,
                    mt: 1,
                    zIndex: 10,
                    maxHeight: 300,
                    overflowY: "auto",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    animation: "slideDown 0.3s ease",
                    "@keyframes slideDown": {
                      from: { opacity: 0, transform: "translateY(-10px)" },
                      to: { opacity: 1, transform: "translateY(0)" },
                    },
                  }}
                >
                  {filteredProducts.slice(0, 5).map((pro) => (
                    <Box
                      key={pro.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        px: 2,
                        py: 1.5,
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                        "&:hover": { bgcolor: "#f8f8f8" },
                      }}
                      onClick={() => {
                        router.push(`/product/${pro.id}`);
                        setSearch("");
                      }}
                    >
                      {/* Product image */}
                      {pro.image_urls &&
                        pro.image_urls.length > 0 &&
                        pro.image_urls[0] && (
                          <Box
                            component="img"
                            src={
                              pro.image_urls[0].startsWith("http")
                                ? pro.image_urls[0]
                                : `/assets/${pro.image_urls[0]}`
                            }
                            alt={pro.title}
                            sx={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                              borderRadius: 1.5,
                            }}
                          />
                        )}

                      {/* Product details */}
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: "#333" }}>
                          {pro.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#EC407A", fontWeight: "bold" }}>
                          ${pro.price}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                  {filteredProducts.length > 5 && (
                    <Box sx={{ p: 1.5, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        {filteredProducts.length - 5} more results
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>

            {/* User section - Desktop */}
            <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1.5 }}>
              {firstName ? (
                <>
                  <Button
                    startIcon={<AccountCircleIcon />}
                    onClick={handleUserMenuOpen}
                    sx={{
                      color: "#333",
                      textTransform: "none",
                      fontWeight: 500,
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      "&:hover": {
                        bgcolor: "rgba(236, 64, 122, 0.1)",
                      },
                    }}
                  >
                    Hi, {firstName}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleCloseUserMenu}
                    PaperProps={{
                      elevation: 3,
                      sx: {
                        mt: 1.5,
                        borderRadius: 2,
                        minWidth: 180,
                        overflow: "visible",
                        "&:before": {
                          content: '""',
                          display: "block",
                          position: "absolute",
                          top: 0,
                          right: 14,
                          width: 10,
                          height: 10,
                          bgcolor: "background.paper",
                          transform: "translateY(-50%) rotate(45deg)",
                          zIndex: 0,
                        },
                      },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  >
                    <MenuItem onClick={() => { router.push(`/user/${userId}`); handleCloseUserMenu(); }}>
                      <AccountCircleIcon sx={{ mr: 1.5 }} fontSize="small" />
                      My Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <LogoutIcon sx={{ mr: 1.5 }} fontSize="small" />
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  component={Link}
                  href="/login"
                  startIcon={<LoginIcon />}
                  sx={{
                    color: "#333",
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    "&:hover": {
                      bgcolor: "rgba(236, 64, 122, 0.1)",
                    },
                  }}
                >
                  Login
                </Button>
              )}

              {/* Cart */}
              <IconButton
                color="inherit"
                onClick={() => {
                  if (pathname === "/cart") return;
                  setOpenCart(true);
                }}
                sx={{
                  color: "#333",
                  bgcolor: "rgba(236, 64, 122, 0.1)",
                  borderRadius: 2,
                  p: 1.2,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(236, 64, 122, 0.2)",
                    transform: "scale(1.05)",
                  },
                }}
              >
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Box>

            {/* Mobile menu button */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                color="inherit"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                sx={{ color: "#333" }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>

          {/* Mobile menu */}
          <Box
            sx={{
              display: { xs: mobileMenuOpen ? "flex" : "none", md: "none" },
              flexDirection: "column",
              pb: 2,
              animation: "slideDown 0.3s ease",
            }}
          >
            <Box sx={{ px: 2, mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search products..."
                variant="outlined"
                sx={{ 
                  bgcolor: "#f5f5f5", 
                  borderRadius: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 3,
                  },
                }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#EC407A" }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
            
            <Box sx={{ display: "flex", justifyContent: "space-around", px: 2 }}>
              {firstName ? (
                <>
                  <Button
                    startIcon={<AccountCircleIcon />}
                    onClick={() => router.push(`/user/${userId}`)}
                    sx={{
                      color: "#333",
                      textTransform: "none",
                    }}
                  >
                    Profile
                  </Button>
                  <Button
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                    sx={{
                      color: "#333",
                      textTransform: "none",
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  component={Link}
                  href="/login"
                  startIcon={<LoginIcon />}
                  sx={{
                    color: "#333",
                    textTransform: "none",
                  }}
                >
                  Login
                </Button>
              )}
              
              <IconButton
                color="inherit"
                onClick={() => {
                  if (pathname === "/cart") return;
                  setOpenCart(true);
                  setMobileMenuOpen(false);
                }}
                sx={{ color: "#333" }}
              >
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Box>
          </Box>
        </Container>
      </AppBar>

      {/* Categories */}
      <Box 
        sx={{ 
          mt: 8.5, 
          bgcolor: "#ffffff", 
          py: 1.5,
          borderBottom: "1px solid #f0f0f0",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ 
            display: "flex", 
            gap: 2, 
            justifyContent: "center",
            overflowX: "auto",
            "&::-webkit-scrollbar": {
              height: 4,
            },
            "&::-webkit-scrollbar-track": {
              bgcolor: "#f1f1f1",
              borderRadius: 10,
            },
            "&::-webkit-scrollbar-thumb": {
              bgcolor: "#EC407A",
              borderRadius: 10,
            },
          }}>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                component={Link}
                href={`/category/${cat.id}`}
                variant="text"
                sx={{
                  color: "#555",
                  fontWeight: 500,
                  borderRadius: "20px",
                  textTransform: "none",
                  px: 2.5,
                  py: 0.8,
                  whiteSpace: "nowrap",
                  position: "relative",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    color: "#EC407A",
                    bgcolor: "rgba(236, 64, 122, 0.08)",
                  },
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    width: 0,
                    height: 2,
                    bottom: 0,
                    left: "50%",
                    bgcolor: "#EC407A",
                    transition: "all 0.3s ease",
                    transform: "translateX(-50%)",
                  },
                  "&:hover:after": {
                    width: "70%",
                  },
                }}
              >
                {cat.name}
              </Button>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Cart Drawer */}
      <CartDrawer 
        open={openCart} 
        onClose={() => setOpenCart(false)} 
      />
    </>
  );
}