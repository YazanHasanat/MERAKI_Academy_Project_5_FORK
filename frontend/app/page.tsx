"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Chip,
  IconButton,
  useTheme,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import homePage from "../public/assets/home.png";
import axios from "axios";
import Slider from "react-slick";
import Loading from "./loading";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Star from "@mui/icons-material/Star";
import ShoppingCart from "@mui/icons-material/ShoppingCart";
import ArrowForward from "@mui/icons-material/ArrowForward";

export interface Category {
  id: string;
  name: string;
  image_url: string;
}
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

export default function HeroSection() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product[]>([]);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  const handleAddToCart = async (productId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setSnackbarMessage("⚠️ You must log in first");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      await axios.post(
        "http://localhost:5000/cart/add",
        { product_id: productId, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnackbarMessage("Product added to cart!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error adding to cart", error);
      setSnackbarMessage("Something went wrong. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const getAllCategory = async () => {
    try {
      const result = await axios.get("http://localhost:5000/categories");
      setCategories(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getFeaturedProducts = async () => {
    try {
      const result = await axios.get("http://localhost:5000/products/featured");
      setProduct(result.data.products);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getFeaturedProducts();
  }, []);

  if (categories.length === 0 || product.length === 0) return <Loading />;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    centerMode: isMobile ? false : true,
    centerPadding: isMobile ? "0px" : "40px",
    responsive: [
      {
        breakpoint: 960,
        settings: { slidesToShow: 2, centerMode: false },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1, centerMode: false },
      },
    ],
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <Box>
      {/* Hero Section with background image */}
      <Box
        sx={{
          position: "relative",
          height: isMobile ? "70vh" : "85vh",
          backgroundImage: `url(${homePage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          overflow: "hidden",
        }}
      >
        {/* Overlay with gradient */}
    

        {/* Animated background elements */}
        <Box
          component={motion.div}
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          sx={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
            top: "10%",
            left: "10%",
          }}
        />
        <Box
          component={motion.div}
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          sx={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
            bottom: "10%",
            right: "10%",
          }}
        />

        {/* Hero Content */}
        <Box
          sx={{ position: "relative", textAlign: "center", zIndex: 1, px: 3 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <Typography
              variant={isMobile ? "h3" : "h2"}
              gutterBottom
              sx={{
                fontWeight: "bold",
                textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
                mb: 2,
              }}
            >
              Welcome to KiddyJoy
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <Typography
              variant={isMobile ? "h6" : "h5"}
              gutterBottom
              sx={{ mb: 4, textShadow: "1px 1px 5px rgba(0,0,0,0.4)" }}
            >
              Discover the best products for your baby 🍼🧸
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForward />}
              sx={{
                background: "linear-gradient(45deg, #EC407A, #F48FB1)",
                color: "#fff",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                borderRadius: "30px",
                boxShadow: "0 4px 15px rgba(236, 64, 122, 0.4)",
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow: "0 6px 20px rgba(236, 64, 122, 0.6)",
                  background: "linear-gradient(45deg, #D81B60, #EC407A)",
                },
              }}
              onClick={() => router.push("/offers")}
            >
              Shop Now
            </Button>
          </motion.div>
        </Box>
      </Box>

      {/* Featured Products Section */}
      <Box sx={{ py: 8, px: 3, bgcolor: "#FFF5F8" }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#333",
              position: "relative",
              display: "inline-block",
              "&:after": {
                content: '""',
                position: "absolute",
                width: "60%",
                height: "4px",
                bottom: "-10px",
                left: "20%",
                bgcolor: "#EC407A",
                borderRadius: "2px",
              },
            }}
          >
            Featured Products
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 3, color: "#666", maxWidth: "600px", mx: "auto" }}
          >
            Discover our handpicked selection of premium baby products that
            combine safety, comfort, and style
          </Typography>
        </Box>

        <Slider {...sliderSettings}>
          {product.map((prod) => (
            <Box key={prod.id} sx={{ px: 1 }}>
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  transition: "all 0.4s ease",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 15px 30px rgba(236, 64, 122, 0.2)",
                  },
                }}
                onMouseEnter={() => setHoveredProduct(prod.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                {/* Product Badge */}
                <Chip
                  label="Featured"
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 10,
                    left: 10,
                    bgcolor: "#EC407A",
                    color: "white",
                    fontWeight: "bold",
                    zIndex: 1,
                  }}
                />

                {/* Product Image */}
                <Box
                  sx={{ position: "relative", overflow: "hidden", height: 240 }}
                >
                  <CardMedia
                    component="img"
                    image={`/assets/${prod.image_urls[0]}`}
                    alt={prod.title}
                    sx={{
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                      transform:
                        hoveredProduct === prod.id ? "scale(1.1)" : "scale(1)",
                    }}
                  />

                  {/* Quick Actions Overlay */}
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                      p: 2,
                      display: "flex",
                      justifyContent: "center",
                      opacity: hoveredProduct === prod.id ? 1 : 0,
                      transition: "opacity 0.3s ease",
                    }}
                  >
                    <IconButton
                      sx={{
                        bgcolor: "white",
                        color: "#EC407A",
                        "&:hover": {
                          bgcolor: "#EC407A",
                          color: "white",
                          transform: "scale(1.1)",
                        },
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(prod.id);
                      }}
                    >
                      <ShoppingCart />
                    </IconButton>
                  </Box>
                </Box>

                {/* Product Details */}
                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: "bold",
                      mb: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {prod.title}
                  </Typography>

                  {/* Rating */}
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        sx={{
                          fontSize: 16,
                          color: i < 4 ? "#FFD700" : "#E0E0E0",
                        }}
                      />
                    ))}
                    <Typography variant="caption" sx={{ ml: 1, color: "#666" }}>
                      (4.0)
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: "auto",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: "bold", color: "#EC407A" }}
                    >
                      {prod.price} JD
                    </Typography>
                    <Button
                      variant="contained"
                      size="small"
                      sx={{
                        bgcolor: "#EC407A",
                        color: "white",
                        borderRadius: "20px",
                        textTransform: "none",
                        px: 2,
                        "&:hover": {
                          bgcolor: "#D81B60",
                        },
                      }}
                      onClick={() => {
                        router.push(`/product/${prod.id}`);
                      }}
                    >
                      View
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Categories Section */}
      <Box sx={{ py: 8, px: 2, bgcolor: "#FFFFFF" }}>
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: "bold",
              color: "#333",
              position: "relative",
              display: "inline-block",
              "&:after": {
                content: '""',
                position: "absolute",
                width: "60%",
                height: "4px",
                bottom: "-10px",
                left: "20%",
                bgcolor: "#EC407A",
                borderRadius: "2px",
              },
            }}
          >
            🍼 Shop by Categories
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 3, color: "#666", maxWidth: "600px", mx: "auto" }}
          >
            Browse our wide range of baby products organized by categories for
            your convenience
          </Typography>
        </Box>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <Grid container spacing={4} justifyContent="center">
            {categories.map((cat, index) => (
              <Grid key={cat.id}>
                <Card
                  onClick={() => router.push(`/category/${cat.id}`)}
                  sx={{
                    borderRadius: 3,
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.08)",
                    "&:hover": {
                      transform: "translateY(-10px)",
                      boxShadow: "0 15px 30px rgba(236, 64, 122, 0.2)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: "relative",
                      overflow: "hidden",
                      height: 200,
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="100%"
                      image={`/assets/${cat.image_url}`}
                      alt={cat.name}
                      sx={{
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.5))",
                      }}
                    />
                  </Box>
                  <CardContent
                    sx={{
                      textAlign: "center",
                      p: 2,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 600,
                        color: "#333",
                      }}
                    >
                      {cat.name}
                    </Typography>
                    <Button
                      variant="text"
                      sx={{
                        mt: 1,
                        color: "#EC407A",
                        textTransform: "none",
                        fontWeight: "bold",
                        "&:hover": {
                          bgcolor: "rgba(236, 64, 122, 0.1)",
                        },
                      }}
                    >
                      Shop Now →
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
