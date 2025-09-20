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

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

}