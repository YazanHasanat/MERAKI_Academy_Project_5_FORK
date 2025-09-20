
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
  }}
return (
    <div>productPage</div>
  );
}
export default productPage;
