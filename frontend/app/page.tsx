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
} from "@mui/material";
import homePage from "../public/assets/home.png";
import axios from "axios";
import Slider from "react-slick";
import Loading from "./loading";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product[]>([]);

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
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getFeaturedProducts();
  }, []);

  if (categories.length === 0 || product.length === 0)
    return <Loading />;

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    responsive: [
      {
        breakpoint: 960,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <Box>
      {/* Hero */}
      <Box
        sx={{
          position: "relative",
          height: "85vh",
          backgroundImage: `url(${homePage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        {/* Gradient overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(rgba(0,0,0,0.4), rgba(255,192,203,0.5))",
          }}
        />

        <Box sx={{ position: "relative", textAlign: "center", zIndex: 1 }}>
          <Typography
            variant="h2"
            gutterBottom
            sx={{
              fontWeight: "bold",
              textShadow: "2px 2px 10px rgba(0,0,0,0.5)",
            }}
          >
            Welcome to Our Baby Shop
          </Typography>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mb: 3, textShadow: "1px 1px 5px rgba(0,0,0,0.4)" }}
          >
            Discover the best products for your baby
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: "linear-gradient(45deg, #ff80ab, #ff4081)",
              color: "#fff",
              fontWeight: "bold",
              px: 4,
              py: 1.5,
              borderRadius: "30px",
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
              },
            }}
          >
            Shop Now
          </Button>
        </Box>
      </Box>

      {/* Featured Products */}
      {/* Featured Products */}
      <Box sx={{ mt: 6, px: 3 }}>
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          sx={{ fontWeight: "bold", mb: 4 }}
        >
           Featured Products 
        </Typography>
        <Slider {...sliderSettings}>
          {product.map((prod) => (
            <Box key={prod.id} sx={{ px: 1 }}>
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  backdropFilter: "blur(8px)",
                  background: "rgba(255,255,255,0.8)",
                  transition: "0.4s",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.05)",
                    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="240"
                  image={`/assets/${prod.image_urls[0]}`}
                  alt={prod.title}
                  sx={{
                    objectFit: "cover",
                    transition: "0.4s",
                    "&:hover": { transform: "scale(1.1)" },
                  }}
                />
                <CardContent sx={{ textAlign: "center" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                    {prod.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${prod.price}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 2,
                      borderRadius: "20px",
                      textTransform: "none",
                      transition: "0.3s",
                      "&:hover": {
                        backgroundColor: "#ff4081",
                        color: "#fff",
                      },
                    }}
                    onClick={()=>{
                      window.location.href = `/product/${prod.id}`;
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* Categories */}
      <Box sx={{ py: 8, px: 2, bgcolor: "#f9f9f9" }}>
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          sx={{ fontWeight: "bold", mb: 4 }}
        >
          🍼 Shop by Categories
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {categories.map((cat) => (
            <Grid key={cat.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={cat.image_url}
                  alt={cat.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    textAlign="center"
                    sx={{ fontWeight: 600 }}
                  >
                    {cat.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
