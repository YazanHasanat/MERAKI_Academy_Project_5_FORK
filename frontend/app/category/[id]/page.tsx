"use client";
import { useEffect, useState, useMemo } from "react";
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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import SortIcon from "@mui/icons-material/Sort";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import StarIcon from "@mui/icons-material/Star";

import StarIconFull from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const StarRating = ({ rating }: { rating: number }) => {
  rating = Math.min(5, Math.max(0, rating));
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <Box display="flex" justifyContent="center" alignItems="center">
      {[...Array(fullStars)].map((_, i) => (
        <StarIconFull key={`full-${i}`} sx={{ color: "#FFC107" }} />
      ))}
      {hasHalfStar && <StarHalfIcon sx={{ color: "#FFC107" }} />}
      {[...Array(emptyStars)].map((_, i) => (
        <StarBorderIcon key={`empty-${i}`} sx={{ color: "#FFC107" }} />
      ))}
    </Box>
  );
};

enum SortOption {
  Default,
  PriceAsc,
  PriceDesc,
  TopRated,
}

const SortMenu = ({
  activeSort,
  onSortChange,
}: {
  activeSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const sortOptions = [
    { key: SortOption.Default, label: "Recommended", icon: <SortIcon fontSize="small" /> },
    { key: SortOption.PriceAsc, label: "Price: Low to High", icon: <ArrowUpwardIcon fontSize="small" /> },
    { key: SortOption.PriceDesc, label: "Price: High to Low", icon: <ArrowDownwardIcon fontSize="small" /> },
    { key: SortOption.TopRated, label: "Top Rated", icon: <StarIcon fontSize="small" /> },
  ];

  const currentSortLabel =
    sortOptions.find((o) => o.key === activeSort)?.label || "Recommended";

  return (
    <div>
      <Button
        variant="outlined"
        startIcon={<SortIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ textTransform: "none" }}
      >
        Sort By: {currentSortLabel}
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        {sortOptions.map((option) => (
          <MenuItem
            key={option.key}
            selected={option.key === activeSort}
            onClick={() => {
              onSortChange(option.key);
              setAnchorEl(null);
            }}
          >
            <ListItemIcon>{option.icon}</ListItemIcon>
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

const CategoryPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [ratings, setRatings] = useState<{ [key: string]: { average: number; count: number } }>({});
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.Default);

  const user = { id: 1 };

  const CategoryData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/products/category/${id}`);
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

  const sortedProducts = useMemo(() => {
    let sorted = [...products];
    switch (sortOption) {
      case SortOption.PriceAsc:
        sorted.sort((a, b) => a.price - b.price);
        break;
      case SortOption.PriceDesc:
        sorted.sort((a, b) => b.price - a.price);
        break;
      case SortOption.TopRated:
        sorted.sort(
          (a, b) => (ratings[b.id]?.average || 0) - (ratings[a.id]?.average || 0)
        );
        break;
      default:
        break;
    }
    return sorted;
  }, [products, ratings, sortOption]);

  if (loading) {
    return (
      <Typography variant="h6" align="center">
        Loading...
      </Typography>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            color: "#EC407A",
          }}
        >
          {categoryName}
        </Typography>
        <SortMenu activeSort={sortOption} onSortChange={setSortOption} />
      </Box>

      <Typography
        variant="body1"
        align="center"
        sx={{ mb: 4, color: "#010000ff", maxWidth: "700px", mx: "auto" }}
      >
        {categoryName || "Shop the best products in this category."}
      </Typography>

      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {sortedProducts.map((product: any) => (
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
                image={
                  product.image_urls && product.image_urls.length > 0
                    ? product.image_urls[0].startsWith("http")
                      ? product.image_urls[0]
                      : `/assets/${product.image_urls[0]}`
                    : "/assets/home.png"
                }
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
                <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                  <Button
                    variant="contained"
                    size="small"
                    sx={(theme) => ({
                      textTransform: "none",
                      borderRadius: 20,
                      px: 3,
                      py: 1,
                      fontWeight: "bold",
                      bgcolor: theme.palette.mode === "light" ? "#EC407A" : "#d81b60",
                      "&:hover": {
                        bgcolor: theme.palette.mode === "light" ? "#d53972" : "#ad1457",
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
  );
};

export default CategoryPage;
