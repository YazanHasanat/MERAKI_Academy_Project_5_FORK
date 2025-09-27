"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
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
} from "@mui/material";

type Category = {
  id: string;
  name: string;
  description: string;
  image?: string;
};

const CategoryDashBoard: React.FC = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState<string>("");
  const [selectedCategoryToDelete, setSelectedCategoryToDelete] =
    useState<string>("");
  const getAllCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  React.useEffect(() => {
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
      setMessage("Please select an image");
      return;
    }
    try {
      const imageUrl = await uploadImage();
      const categoryData = { ...form, image: imageUrl };
      await axios.post("http://localhost:5000/categories", categoryData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Category added successfully!");
      setForm({ name: "", description: "" });
      setImage(null);
      setPreview(null);
    } catch (err) {
      console.error(err);
      setMessage("Failed to add category");
    }
  };

  const handleDeleteCategory = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCategoryToDelete) {
      setMessage("Please select a category to delete");
      return;
    }
    try {
      await axios.delete(
        `http://localhost:5000/categories/${selectedCategoryToDelete}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMessage("Category deleted successfully!");
      setSelectedCategoryToDelete("");
    } catch (err) {
      console.error(err);
      setMessage("Failed to delete category");
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 700, margin: "auto", mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Add Category
      </Typography>

      <Box
        component="form"
        onSubmit={handleAddCategory}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <TextField
          label="Category Name"
          name="name"
          value={form.name}
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

        <Button variant="outlined" component="label">
          Upload Image
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleImageChange}
          />
        </Button>

        {preview && (
          <Box>
            <img
              src={preview}
              alt="preview"
              style={{ width: "150px", borderRadius: "8px" }}
            />
          </Box>
        )}

        <Button type="submit" variant="contained" color="primary">
          Add Category
        </Button>
      </Box>
      <br />
      <Box
        component="form"
        onSubmit={handleDeleteCategory}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <FormControl fullWidth>
          <InputLabel>Select Category to Delete</InputLabel>
          <Select
            value={selectedCategoryToDelete}
            onChange={(e) => {
              setSelectedCategoryToDelete(e.target.value as string);
            }}
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
          sx={{
            width: "250px",
            textAlign: "center",
            margin: "auto",
          }}
        >
          Delete Category
        </Button>
      </Box>
      {message && (
        <Typography color="secondary" mt={2}>
          {message}
        </Typography>
      )}
    </Paper>
  );
};

export default CategoryDashBoard;
