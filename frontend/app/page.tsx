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
import homapage from "../public/assets/home.png";
import axios from "axios";
import Slider from "react-slick";
interface Category {
  id: string;
  name: string;
  image_url: string;
}
interface Product {
  id: number;
  title: string;
  description?: string;
  image_url?: string;
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
  if (!categories || !product)
    return <p style={{ textAlign: "center" }}>Loading...</p>;
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
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
      <Box
        sx={{
          position: "relative",
          height: "80vh",
          backgroundImage: `url(${homapage.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        />

        <Box
          sx={{
            position: "relative",
            textAlign: "center",
            zIndex: 1,
          }}
        >
          <Typography variant="h2" gutterBottom>
            Welcome to Our Baby Shop
          </Typography>
          <Typography variant="h5" gutterBottom>
            Discover the best products for your baby
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{ backgroundColor: "pink" }}
          >
            Shop Now
          </Button>
        </Box>
      </Box>
      {/* Featured Products Section */}
      <Box >
        <Typography variant="h4" gutterBottom textAlign="center">
          Featured Products
        </Typography>
        <Slider {...sliderSettings}>
          {product.map((prod) => (
            <Box key={prod.id} sx={{ px: 1, display: "inline-block" }}>
              <Card
                sx={{
                  width: 200,
                  minWidth: 200,
                  maxWidth: 200,
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <CardMedia
                  component="img"
                  height="160"
                  image={`/assets/${prod.image_url}`}
                  alt={prod.title}
                />
                <CardContent sx={{ p: 1 }}>
                  <Typography variant="h6" textAlign="center" noWrap>
                    {prod.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" textAlign="center">
                    {prod.price} $
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>
      {/* Categories Section */}
      <Box sx={{ py: 8, px: 2 }}>
        <Typography variant="h4" gutterBottom textAlign="center">
          Categories
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {categories.map((cat) => (
            <Grid key={cat.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.05)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="150"
                  image={cat.image_url}
                  alt={cat.name}
                />
                <CardContent>
                  <Typography variant="h6" textAlign="center">
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
