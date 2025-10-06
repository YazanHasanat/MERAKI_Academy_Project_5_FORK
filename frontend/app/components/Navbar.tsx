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
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import axios from "axios";
import { Category } from "../page";
import CartDrawer from "./CartDrawer";
import { usePathname, useRouter } from "next/navigation";
import InputBase from "@mui/material/InputBase";

// ==== MUI Icons ====
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BabyChangingStationIcon from "@mui/icons-material/BabyChangingStation";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import ToysIcon from "@mui/icons-material/Toys";
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  //search
  const [product, setProducts] = React.useState<Product[]>([]);
  const [search, setSearch] = React.useState("");
  const [searchFocused, setSearchFocused] = React.useState(false);

  const [firstName, setFirstName] = React.useState<string | null>(null);
  const [userId, setUserId] = React.useState<string | null>(null);
  const [role, setRole] = React.useState<number | null>(null); 
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = React.useState(false);

  const [categories, setCategories] = React.useState<Category[]>([]);
  const [openCart, setOpenCart] = React.useState(false);
  const [cartItemCount, setCartItemCount] = React.useState(0);

    React.useEffect(() => {
    const loadUser = () => {
      const storedRole = localStorage.getItem("role_id");
      setFirstName(localStorage.getItem("firstName"));
      setUserId(localStorage.getItem("userId"));
      setRole(storedRole ? Number(storedRole) : null); 
      
      const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
      setCartItemCount(cartItems.length);
    };

    loadUser();

    window.addEventListener("storageUpdate", loadUser);

    async function fetchCategories() {
      try {
        const response = await axios.get("https://meraki-academy-project-5-xtxg.onrender.com/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    }
    fetchCategories(); 

    return () => {
      window.removeEventListener("storageUpdate", loadUser);
    };
  }, []);
  const getPrcucts = async () => {
    const results = await axios.get("https://meraki-academy-project-5-xtxg.onrender.com/products");
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
    setRole(null); 
    handleCloseUserMenu();
    router.push("/");
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorEl(null);
  };

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes("toy") || name.includes("game")) return <ToysIcon />;
    if (name.includes("baby") || name.includes("infant")) return <BabyChangingStationIcon />;
    return <ChildCareIcon />;
  };


  if (role == 2 || role == 3 || pathname.startsWith("/unauthorized"))
    return <div></div>;
  if (pathname.startsWith("/checkout")) return <SimpleNavbar />;

  return (
    <>
      <AppBar 
        position="fixed" 
        sx={{ 
          bgcolor: "#FFFFFF", 
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          color: "#333",
          zIndex: 1100
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1 }}>
            {/* Logo */}
            <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
              <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                <Box
                  component="img"
                  src="/assets/logo2.png"
                  alt="KiddyJoy Logo"
                  sx={{
                    height: "45px",
                    width: "auto",
                    objectFit: "contain",
                    mr: 1,
                  }}
                />
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

            {/* Desktop Navigation */}
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 3, flexGrow: 1, justifyContent: "center" }}>
                <Button
                  component={Link}
                  href="/"
                  sx={{
                    color: pathname === "/" ? "#EC407A" : "#666",
                    fontWeight: pathname === "/" ? "bold" : "normal",
                    borderBottom: pathname === "/" ? "2px solid #EC407A" : "none",
                    borderRadius: 0,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      color: "#EC407A",
                      bgcolor: "rgba(236, 64, 122, 0.04)",
                    },
                  }}
                >
                  Home
                </Button>
                <Button
                  component={Link}
                  href="/offers"
                  sx={{
                    color: pathname === "/offers" ? "#EC407A" : "#666",
                    fontWeight: pathname === "/offers" ? "bold" : "normal",
                    borderBottom: pathname === "/offers" ? "2px solid #EC407A" : "none",
                    borderRadius: 0,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      color: "#EC407A",
                      bgcolor: "rgba(236, 64, 122, 0.04)",
                    },
                  }}
                >
                  Shop
                </Button>
                <Button
                  component={Link}
                  href="/about"
                  sx={{
                    color: pathname === "/about" ? "#EC407A" : "#666",
                    fontWeight: pathname === "/about" ? "bold" : "normal",
                    borderBottom: pathname === "/about" ? "2px solid #EC407A" : "none",
                    borderRadius: 0,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      color: "#EC407A",
                      bgcolor: "rgba(236, 64, 122, 0.04)",
                    },
                  }}
                >
                  About
                </Button>
                <Button
                  component={Link}
                  href="/contactus"
                  sx={{
                    color: pathname === "/contactus" ? "#EC407A" : "#666",
                    fontWeight: pathname === "/contact" ? "bold" : "normal",
                    borderBottom: pathname === "/contact" ? "2px solid #EC407A" : "none",
                    borderRadius: 0,
                    textTransform: "none",
                    fontSize: "1rem",
                    "&:hover": {
                      color: "#EC407A",
                      bgcolor: "rgba(236, 64, 122, 0.04)",
                    },
                  }}
                >
                  Contact
                </Button>
                
                {/* Categories Dropdown */}
                <Button
                  onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                  sx={{
                    color: "#666",
                    textTransform: "none",
                    fontSize: "1rem",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    "&:hover": {
                      color: "#EC407A",
                      bgcolor: "rgba(236, 64, 122, 0.04)",
                    },
                  }}
                >
                  Categories
                  <ExpandMoreIcon sx={{ transition: "transform 0.2s", transform: categoryMenuOpen ? "rotate(180deg)" : "none" }} />
                </Button>
              </Box>
            )}

            {/* Search Bar */}
            {!isMobile && (
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (search.trim()) {
                    router.push(`/search?q=${encodeURIComponent(search)}`);
                    setSearch("");
                  }
                }}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "#F5F5F5",
                  borderRadius: "25px",
                  px: 2,
                  py: 0.5,
                  mr: 2,
                  width: "250px",
                  position: "relative"
                }}
              >
                <InputBase
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  sx={{ flex: 1, fontSize: "0.9rem" }}
                />
                {search && (
                  <IconButton size="small" onClick={() => setSearch("")}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                )}
                <IconButton type="submit" size="small" sx={{ color: "#EC407A" }}>
                  <SearchIcon />
                </IconButton>

                {/* Search Results Dropdown */}
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
            )}

            {/* Right Side Icons */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {firstName ? (
                <>
                  <Button
                    startIcon={<AccountCircleIcon />}
                    onClick={handleUserMenuOpen}
                    sx={{
                      color: "#666",
                      textTransform: "none",
                      fontWeight: 500,
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      "&:hover": {
                        color: "#EC407A",
                        bgcolor: "rgba(236, 64, 122, 0.04)",
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
                    color: "#666",
                    textTransform: "none",
                    fontWeight: 500,
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    "&:hover": {
                      color: "#EC407A",
                      bgcolor: "rgba(236, 64, 122, 0.04)",
                    },
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
                }}
                sx={{
                  color: "#666",
                  "&:hover": { color: "#EC407A" },
                }}
              >
                <Badge badgeContent={cartItemCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              {isMobile && (
                <IconButton
                  onClick={() => setMobileMenuOpen(true)}
                  sx={{ color: "#666" }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>

          {/* Categories Dropdown Menu */}
          {!isMobile && (
            <Collapse in={categoryMenuOpen}>
              <Box sx={{ bgcolor: "#FAFAFA", py: 2, borderTop: "1px solid #E0E0E0" }}>
                <Container maxWidth="xl">
                  <Box sx={{ display: "flex", gap: 3, justifyContent: "center" }}>
                    {categories.map((category) => (
                      <Button
                        key={category.id}
                        component={Link}
                        href={`/category/${category.id}`}
                        onClick={() => setCategoryMenuOpen(false)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: "#666",
                          textTransform: "none",
                          py: 1,
                          px: 2,
                          borderRadius: 2,
                          "&:hover": {
                            bgcolor: "#EC407A",
                            color: "white",
                          },
                        }}
                      >
                        {getCategoryIcon(category.name)}
                        {category.name}
                      </Button>
                    ))}
                  </Box>
                </Container>
              </Box>
            </Collapse>
          )}
        </Container>
      </AppBar>

      {/* Spacer to prevent content from being hidden behind the navbar */}
      <Box sx={{ height: { xs: "64px", md: categoryMenuOpen ? "120px" : "64px" } }} />

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      >
        <Box sx={{ width: 280, pt: 2 }}>
          <Box sx={{ p: 2, borderBottom: "1px solid #E0E0E0" }}>
            <Typography variant="h6" sx={{ color: "#EC407A", fontWeight: "bold" }}>
              Menu
            </Typography>
          </Box>
          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  color: pathname === "/" ? "#EC407A" : "#666",
                  "&:hover": { bgcolor: "rgba(236, 64, 122, 0.04)" },
                }}
              >
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/offers"
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  color: pathname === "/offers" ? "#EC407A" : "#666",
                  "&:hover": { bgcolor: "rgba(236, 64, 122, 0.04)" },
                }}
              >
                <ListItemText primary="Shop" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/about"
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  color: pathname === "/about" ? "#EC407A" : "#666",
                  "&:hover": { bgcolor: "rgba(236, 64, 122, 0.04)" },
                }}
              >
                <ListItemText primary="About" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                href="/contactus"
                onClick={() => setMobileMenuOpen(false)}
                sx={{
                  color: pathname === "/contactus" ? "#EC407A" : "#666",
                  "&:hover": { bgcolor: "rgba(236, 64, 122, 0.04)" },
                }}
              >
                <ListItemText primary="Contact" />
              </ListItemButton>
            </ListItem>
            
            <Divider />
            
            <ListItem disablePadding>
              <ListItemButton onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}>
                <ListItemText primary="Categories" />
                <ExpandMoreIcon sx={{ transform: categoryMenuOpen ? "rotate(180deg)" : "none" }} />
              </ListItemButton>
            </ListItem>
            
            <Collapse in={categoryMenuOpen}>
              <List component="div" disablePadding>
                {categories.map((category) => (
                  <ListItem key={category.id} disablePadding>
                    <ListItemButton
                      component={Link}
                      href={`/category/${category.id}`}
                      onClick={() => {
                        setCategoryMenuOpen(false);
                        setMobileMenuOpen(false);
                      }}
                      sx={{ pl: 4 }}
                    >
                      {getCategoryIcon(category.name)}
                      <ListItemText primary={category.name} sx={{ ml: 2 }} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Collapse>

            <Divider />

            {firstName ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    component={Link}
                    href={`/user/${userId}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <AccountCircleIcon sx={{ mr: 2 }} />
                    <ListItemText primary="My Profile" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 2 }} />
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LoginIcon sx={{ mr: 2 }} />
                  <ListItemText primary="Login" />
                </ListItemButton>
              </ListItem>
            )}
          </List>
        </Box>
      </Drawer>

      {/* Cart Drawer */}
      <CartDrawer 
        open={openCart} 
        onClose={() => setOpenCart(false)} 
      />
    </>
  );
}