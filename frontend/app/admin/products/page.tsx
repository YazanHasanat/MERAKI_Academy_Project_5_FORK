"use client";
import { SelectChangeEvent } from "@mui/material";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  FormControlLabel,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";

// Types
interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  title: string;
  description?: string;
  price: number;
  category_id: string;
  images?: string[];
  isFeatured: boolean;
}

interface FormState {
  title: string;
  description: string;
  price: string;
  category_id: string;
  isFeatured: boolean;
}

const ProductDashBoard: React.FC = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    price: "",
    category_id: "",
    isFeatured: false,
  });

  const [images, setImages] = useState<File[]>([]);
  const [preview, setPreview] = useState<string[]>([]);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // Loading state for Add button
  const [loading, setLoading] = useState(false);

  const [selectedProductToDelete, setSelectedProductToDelete] = useState<string>("");

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>("http://localhost:5000/categories");
        setCategories(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await axios.get<{ products: Product[] }>("http://localhost:5000/products");
      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handlers
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    if (!name) return;

    const isCheckbox = (e.target as HTMLInputElement).type === "checkbox";
    const checked = (e.target as HTMLInputElement).checked;

    setForm({
      ...form,
      [name]: isCheckbox ? checked : value,
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImages(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const uploadImages = async (): Promise<string[]> => {
    const uploaders = images.map((image) => {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "tecknest");
      data.append("cloud_name", "dv2a5welg");

      return axios
        .post("https://api.cloudinary.com/v1_1/dv2a5welg/image/upload", data)
        .then((res) => res.data.secure_url);
    });
    return Promise.all(uploaders);
  };

  const handleAddProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imageUrls = await uploadImages();
      const productData = {
        title: form.title,
        description: form.description,
        price: parseFloat(form.price),
        category_id: form.category_id,
        isFeatured: form.isFeatured,
        image_urls: imageUrls.length ? imageUrls : [],
      };

      await axios.post("http://localhost:5000/products", productData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbarMessage("Product added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setForm({
        title: "",
        description: "",
        price: "",
        category_id: "",
        isFeatured: false,
      });
      setImages([]);
      setPreview([]);

      await fetchProducts(); // تحديث المنتجات بعد الإضافة
    } catch (err) {
      console.error("Error creating product:", err);
      setSnackbarMessage("Failed to add product");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProductToDelete) {
      setSnackbarMessage("Please select a product to delete");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/products/${selectedProductToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSnackbarMessage("Product deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setSelectedProductToDelete("");

      await fetchProducts(); // تحديث المنتجات بعد الحذف
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to delete product");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 700, margin: "auto", mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Admin Dashboard - Add Product
      </Typography>

      {/* Add Product Form */}
      <Box
        component="form"
        onSubmit={handleAddProduct}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Product Name"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={3}
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={form.price}
          onChange={handleChange}
          required
        />

        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            name="category_id"
            value={form.category_id}
            label="Category"
            onChange={handleChange}
            required
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControlLabel
          control={<Checkbox checked={form.isFeatured} onChange={handleChange} name="isFeatured" />}
          label="Featured"
        />

        <Button variant="outlined" component="label">
          Upload Images
          <input type="file" hidden multiple accept="image/*" onChange={handleImageChange} />
        </Button>

        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {preview.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`preview-${idx}`}
              style={{ width: "100px", borderRadius: "8px" }}
            />
          ))}
        </Box>

        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Add Product"}
        </Button>
      </Box>

      {/* Delete Product Form */}
      <Box
        component="form"
        onSubmit={handleDeleteProduct}
        sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}
      >
        <FormControl fullWidth>
          <InputLabel>Select Product to Delete</InputLabel>
          <Select
            value={selectedProductToDelete}
            onChange={(e) => setSelectedProductToDelete(e.target.value)}
            required
          >
            {products.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.title}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="error"
          sx={{ width: "250px", textAlign: "center", margin: "auto" }}
        >
          Delete Product
        </Button>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ProductDashBoard;
