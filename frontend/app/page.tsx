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
import homapage from "./assets/home.png";
import axios from "axios";

interface Category {
  id: string;
  name: string;
  image_url: string;
}

export default function HeroSection() {
  const [categories, setCategories] = useState<Category[]>([]);

  const getAllCategory = async () => {
    try {
      const result = await axios.get("http://localhost:5000/categories");
      setCategories(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

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

      {/* Categories Section */}
      <Box sx={{ py: 8, px: 2 }} >
        <Typography variant="h4" gutterBottom textAlign="center">
          Categories
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {categories.map((cat) => (
            <Grid  key={cat.id}>
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
                  image={cat.image_url} // لاحظ: اسم الحقل من الـ API
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
