"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";
import Button from "@mui/material/Button";

const CategoryPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  // جلب بيانات المنتجات
  const CategoryData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/products/category/${id}`);
      const data = res.data.products || res.data;
      setProducts(data);

      if (Array.isArray(data) && data.length > 0) {
        setCategoryName(data[0].category_name || "");
      } else {
        setCategoryName("");
      }
    } catch (err) {
      setCategoryName("");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    CategoryData();
  }, [id]);

  if (loading) {
    return <Typography variant="h6" align="center">Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "#f7f7fa" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4, color: "#1976d2" }}
      >
        {categoryName}
      </Typography>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {Array.isArray(products) &&
          products.map((product: any) => (
            <Grid key={product.id} display="flex" justifyContent="center">
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: 6,
                  borderRadius: 4,
                  transition: "transform 0.3s, box-shadow 0.3s",
                  "&:hover": {
                    transform: "translateY(-10px) scale(1.05)",
                    boxShadow: 10,
                  },
                  bgcolor: "#fff",
                  mx: "auto",
                  maxWidth: 350,
                }}
              >
                <CardMedia
                  component="img"
                  image={`/assets/${product.image_urls?.[0] || "home.png"}`}
                  alt={product.title}
                  sx={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderTopLeftRadius: 4,
                    borderTopRightRadius: 4,
                  }}
                />
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography
                    gutterBottom
                    variant="h6"
                    sx={{ fontWeight: 700, color: "#333", textAlign: "center" }}
                  >
                    {product.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2, textAlign: "center" }}
                  >
                    {product.description?.slice(0, 60)}...
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    {product.price ? `${product.price} JD` : ""}
                  </Typography>
                </CardContent>
                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{
                        textTransform: "none",
                        borderRadius: 20,
                        px: 3,
                        py: 1,
                        fontWeight: "bold",
                      }}
                    >
                      View Details
                    </Button>
                  </Link>
                </Box>
              </Card>
            </Grid>
          ))}
      </Grid>
    </Box>
  );
};

export default CategoryPage;
