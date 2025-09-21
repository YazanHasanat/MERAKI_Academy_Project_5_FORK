"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Button,
  Chip,
  Divider,
} from "@mui/material";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

interface Product {
  id: number;
  title: string;
  description?: string;
  image_urls: string[];
  category_id?: number;
  price: number;
  is_feature: boolean;
  created_at: string;
  is_deleted: number;
}

const ProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [message, setMessage] = useState<string | null>(null);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get<{ product: Product }>(
          `http://localhost:5000/products/${id}`
        );
        setProduct(res.data.product);
      } catch (error) {
        console.error("Failed to fetch product", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Typography variant="h6" color="error" textAlign="center" mt={5}>
        Product not found.
      </Typography>
    );
  }
  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("⚠️ You must log in first");
        return;
      }

      await axios.post(
        "http://localhost:5000/cart/add",
        {
          product_id: product?.id,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage(" Product added to cart");
    } catch (error) {
      console.error("Error adding to cart", error);
      setMessage(" Failed to add product to cart");
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        mt: 6,
        p: 3,
        boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
        borderRadius: 5,
        bgcolor: "background.paper",
        fontFamily: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`,
      }}
    >
      <Card
        sx={{
          borderRadius: 5,
          overflow: "hidden",
          boxShadow: "0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.07)",
          transition: "transform 0.3s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow:
              "0 16px 32px rgba(0,0,0,0.15), 0 12px 12px rgba(0,0,0,0.1)",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            gap: 2,
            p: 2,
            bgcolor: "#f0f2f5",
            borderRadius: 3,
            mb: 4,
            scrollbarWidth: "thin",
            scrollbarColor: "#bbb transparent",
            "&::-webkit-scrollbar": {
              height: 8,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#bbb",
              borderRadius: 4,
            },
          }}
        >
          {product.image_urls.map((img, index) => (
            <Box
              key={index}
              component="img"
              src={`/assets/${img}`}
              alt={`${product.title} - ${index + 1}`}
              sx={{
                height: 250,
                borderRadius: 3,
                objectFit: "cover",
                flexShrink: 0,
                boxShadow:
                  "0 4px 10px rgba(0,0,0,0.08), inset 0 0 8px rgba(255,255,255,0.3)",
                cursor: "pointer",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)",
                  boxShadow:
                    "0 8px 20px rgba(0,0,0,0.15), inset 0 0 12px rgba(255,255,255,0.4)",
                },
              }}
            />
          ))}
        </Box>

        <CardContent sx={{ p: 6 }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mb={4}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                letterSpacing: "-0.6px",
                color: "text.primary",
                textShadow:
                  "1px 1px 2px rgba(0,0,0,0.05), 0 0 1px rgba(0,0,0,0.05)",
              }}
            >
              {product.title}
            </Typography>
            {product.is_feature && (
              <Chip
                label="Featured"
                color="secondary"
                size="small"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(45deg, #FF6B6B, #FFD93D)",
                  color: "#fff",
                  boxShadow:
                    "0 4px 10px rgba(255, 107, 107, 0.5), 0 0 8px rgba(255, 217, 61, 0.6)",
                }}
              />
            )}
          </Box>

          <Typography
            variant="body1"
            color="text.secondary"
            paragraph
            sx={{
              fontSize: "1.15rem",
              lineHeight: 1.9,
              letterSpacing: "0.02em",
              color: "#444",
            }}
          >
            {product.description || "No description available."}
          </Typography>

          <Divider sx={{ my: 4, borderColor: "#ddd" }} />

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={3}
          >
            <Typography
              variant="h5"
              color="primary"
              sx={{
                fontWeight: 700,
                fontSize: "1.9rem",
                letterSpacing: "-0.02em",
                textShadow:
                  "1px 1px 2px rgba(0,0,0,0.07), 0 0 2px rgba(0,0,0,0.04)",
              }}
            >
              ${Number(product.price).toFixed(2)}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                px: 6,
                py: 1.7,
                fontWeight: 700,
                fontSize: "1.05rem",
                borderRadius: "40px",
                textTransform: "none",
                boxShadow:
                  "0 6px 14px rgba(25, 118, 210, 0.35), 0 3px 6px rgba(25, 118, 210, 0.3)",
                transition: "background-color 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  backgroundColor: "#1565c0",
                  boxShadow:
                    "0 8px 18px rgba(21, 101, 192, 0.5), 0 5px 10px rgba(21, 101, 192, 0.4)",
                },
              }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </Button>
            {message && (
              <Typography
                variant="body2"
                sx={{ mt: 2, color: message.includes("added") ? "green" : "red" }}
              >
                {message}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductPage;
