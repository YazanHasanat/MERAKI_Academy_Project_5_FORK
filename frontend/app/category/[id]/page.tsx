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
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const drawerWidth = 240;

const StarRating = ({ rating }: { rating: number }) => {
  rating = Math.min(5, Math.max(0, rating));
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      {[...Array(fullStars)].map((_, i) => (
        <StarIcon key={`full-${i}`} sx={{ color: "#FFC107" }} />
      ))}
      {hasHalfStar && <StarHalfIcon sx={{ color: "#FFC107" }} />}
      {[...Array(emptyStars)].map((_, i) => (
        <StarBorderIcon key={`empty-${i}`} sx={{ color: "#FFC107" }} />
      ))}
    </Box>
  );
};

const CategoryPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [ratings, setRatings] = useState<{
    [key: string]: { average: number; count: number };
  }>({});
  const [loading, setLoading] = useState(true);

  const user = { id: 1 };

  const categoryDescriptions: { [key: string]: string } = {
    Clothing:
      "Discover the latest clothing collections that combine comfort and style to suit all tastes and occasions.",
    "Toys & Games":
      "Endless fun with the best educational and entertaining toys that help children develop creativity and imagination.",
    Nutrition:
      "A wide variety of food products and supplements to help you maintain a healthy and balanced lifestyle.",
    Furniture:
      "Modern and comfortable furniture with unique designs to give your home a stylish touch that blends beauty and function.",
    "Baby Gear":
      "Everything your baby needs with special care to ensure comfort and safety at all times.",
  };

  const CategoryData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/products/category/${id}`
      );
      const data = res.data.products || res.data;
      setProducts(data);

      setCategoryName(data?.[0]?.category_name || "");

      const ratingsPromises = data.map(async (product: any) => {
        try {
          const ratingRes = await axios.get(
            `http://localhost:5000/products/${product.id}/ratings`,
            { params: { userId: user.id } }
          );
          return {
            id: product.id,
            average: ratingRes.data.averageRating || 0,
            count: ratingRes.data.ratingsCount || 0,
          };
        } catch {
          return { id: product.id, average: 0, count: 0 };
        }
      });

      const ratingsResults = await Promise.all(ratingsPromises);
      const ratingsObj = ratingsResults.reduce((acc, item) => {
        acc[item.id] = {
          average: item.average,
          count: item.count,
        };
        return acc;
      }, {} as any);

      setRatings(ratingsObj);
    } catch (err) {
      console.error(err);
      setCategoryName("");
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
    <Box sx={{ display: "flex" }}>
      {/* ثابت على اليسار - فلتر */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            p: 2,
          },
        }}
      >
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Filters
        </Typography>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Price: Low to High" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Price: High to Low" />
            </ListItemButton>
          </ListItem>

          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Top Rated" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      {/* المحتوى الرئيسي */}
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          p: 4,
          minHeight: "100vh",
          bgcolor: theme.palette.mode === "light" ? "#f7f7fa" : "#121212",
        })}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={(theme) => ({
            fontWeight: "bold",
            mb: 2,
            color: theme.palette.mode === "light" ? "#EC407A" : "#ad1457",
          })}
        >
          {categoryName}
        </Typography>

        <Typography
          variant="body1"
          align="center"
          sx={{ mb: 4, color: "#010000ff", maxWidth: "700px", mx: "auto" }}
        >
          {categoryDescriptions[categoryName] ||
            "Shop the best products in this category."}
        </Typography>

        <Grid container spacing={4} justifyContent="center" alignItems="center">
          {products.map((product: any) => (
            <Grid key={product.id} display="flex" justifyContent="center">
              <Card
                sx={(theme) => ({
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
                  bgcolor: theme.palette.mode === "light" ? "#fff" : "#1e1e1e",
                  mx: "auto",
                  maxWidth: 350,
                })}
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
                    sx={{
                      fontWeight: 700,
                      color: "#333",
                      textAlign: "center",
                    }}
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
                    sx={{
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "#EC407A",
                      mb: 1,
                    }}
                  >
                    {product.price ? `${product.price} JD` : ""}
                  </Typography>
                  <Box sx={{ mt: 1, textAlign: "center" }}>
                    <StarRating rating={ratings[product.id]?.average || 0} />
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      {ratings[product.id]?.average?.toFixed(1) || 0} ⭐ (
                      {ratings[product.id]?.count || 0})
                    </Typography>
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, textAlign: "center" }}>
                  <Link
                    href={`/product/${product.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      sx={(theme) => ({
                        textTransform: "none",
                        borderRadius: 20,
                        px: 3,
                        py: 1,
                        fontWeight: "bold",
                        bgcolor:
                          theme.palette.mode === "light"
                            ? "#EC407A"
                            : "#d81b60",
                        "&:hover": {
                          bgcolor:
                            theme.palette.mode === "light"
                              ? "#d53972"
                              : "#ad1457",
                        },
                      })}
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
    </Box>
  );
};

export default CategoryPage;
