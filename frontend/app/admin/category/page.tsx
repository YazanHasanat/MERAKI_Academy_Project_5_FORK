"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";

type Category = {
  id: string;
  name: string;
  description: string;
  image?: string;
};

const CategoryDashBoard: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">("success");

  // Loader state
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState<string>("");

  const getAllCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    getAllCategories();
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const uploadImage = async (): Promise<string> => {
    if (!image) throw new Error("No image selected");
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "tecknest");
    data.append("cloud_name", "dv2a5welg");
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/dv2a5welg/image/upload",
      data
    );
    return res.data.secure_url as string;
  };

  const handleAddCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!image) {
      setSnackbarMessage("Please select an image");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setLoadingAdd(true);
    try {
      const imageUrl = await uploadImage();
      const categoryData = { ...form, image: imageUrl };
      await axios.post("http://localhost:5000/categories", categoryData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSnackbarMessage("Category added successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      setForm({ name: "", description: "" });
      setImage(null);
      setPreview(null);

      await getAllCategories();
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to add category");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleDeleteCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryToDelete) {
      setSnackbarMessage("Please select a category to delete");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    setLoadingDelete(true);
    try {
      await axios.delete(
        `http://localhost:5000/categories/${selectedCategoryToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSnackbarMessage("Category deleted successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setSelectedCategoryToDelete("");

      await getAllCategories();
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Failed to delete category");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <Paper sx={{ 
      p: { xs: 2, md: 4 }, 
      maxWidth: { xs: "100%", md: 700 }, 
      margin: "auto", 
      mt: 4 
    }}>
      <Typography variant="h4" mb={3}>
        Admin Dashboard - Categories
      </Typography>

      {/* Add Category */}
      <Box
        component="form"
        onSubmit={handleAddCategory}
        sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 4 }}
      >
        <TextField
          label="Category Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
        />

        <Button variant="outlined" component="label" fullWidth>
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>

        {preview && (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <img
              src={preview}
              alt="preview"
              style={{ 
                width: isMobile ? "100%" : "150px", 
                borderRadius: "8px",
                maxHeight: "200px",
                objectFit: "contain"
              }}
            />
          </Box>
        )}

        <Button 
          type="submit" 
          variant="contained" 
          color="primary" 
          disabled={loadingAdd}
          fullWidth
        >
          {loadingAdd ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Add Category"}
        </Button>
      </Box>

      {/* Delete Category */}
      <Box
        component="form"
        onSubmit={handleDeleteCategory}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <FormControl fullWidth>
          <InputLabel>Select Category to Delete</InputLabel>
          <Select
            value={selectedCategoryToDelete}
            onChange={(e) => setSelectedCategoryToDelete(e.target.value)}
            required
          >
            {categories.map((category: Category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="error"
          disabled={loadingDelete}
          fullWidth
        >
          {loadingDelete ? <CircularProgress size={24} sx={{ color: "white" }} /> : "Delete Category"}
        </Button>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CategoryDashBoard;