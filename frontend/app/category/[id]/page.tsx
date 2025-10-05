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
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import Container from "@mui/material/Container";
import Fade from "@mui/material/Fade";
import Slide from "@mui/material/Slide";
import Slider from "@mui/material/Slider";
import Input from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";

import SortIcon from "@mui/icons-material/Sort";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import StarIcon from "@mui/icons-material/Star";
import StarIconFull from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import TuneIcon from "@mui/icons-material/Tune";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import CloseIcon from "@mui/icons-material/Close";
import FilterListIcon from "@mui/icons-material/FilterList";

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
  Newest,
  Popular,
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
    { key: SortOption.Newest, label: "Newest First", icon: <ShoppingBagIcon fontSize="small" /> },
    { key: SortOption.Popular, label: "Most Popular", icon: <LocalOfferIcon fontSize="small" /> },
  ];

  const currentSortLabel =
    sortOptions.find((o) => o.key === activeSort)?.label || "Recommended";

  return (
    <div>
      <Button
        variant="outlined"
        startIcon={<SortIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ 
          textTransform: "none",
          borderColor: "#EC407A",
          color: "#EC407A",
          "&:hover": {
            borderColor: "#d53972",
            backgroundColor: "rgba(236, 64, 122, 0.04)"
          }
        }}
      >
        Sort By: {currentSortLabel}
      </Button>
      <Menu 
        anchorEl={anchorEl} 
        open={open} 
        onClose={() => setAnchorEl(null)}
        TransitionComponent={Fade}
      >
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

const PriceRangeSlider = ({
  value,
  onChange,
  min,
  max,
}: {
  value: [number, number];
  onChange: (value: [number, number]) => void;
  min: number;
  max: number;
}) => {
  const handleInputChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = [...value] as [number, number];
    newValue[index] = Number(event.target.value);
    onChange(newValue);
  };

  return (
    <Box sx={{ px: 2 }}>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Price Range (JD)
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Input
          value={value[0]}
          size="small"
          onChange={handleInputChange(0)}
          inputProps={{
            min: 0,
            max: max,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
          sx={{ width: 70 }}
        />
        <Slider
          value={value}
          onChange={(_, newValue) => onChange(newValue as [number, number])}
          valueLabelDisplay="auto"
          min={min}
          max={max}
          sx={{
            color: "#EC407A",
            "& .MuiSlider-thumb": {
              width: 20,
              height: 20,
            },
          }}
        />
        <Input
          value={value[1]}
          size="small"
          onChange={handleInputChange(1)}
          inputProps={{
            min: 0,
            max: max,
            type: "number",
            "aria-labelledby": "input-slider",
          }}
          sx={{ width: 70 }}
        />
      </Box>
    </Box>
  );
};

const QuickViewModal = ({ 
  product, 
  open, 
  onClose 
}: { 
  product: any; 
  open: boolean; 
  onClose: () => void;
}) => {
  // Check if product is null or undefined
  if (!product) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="quick-view-modal"
      aria-describedby="quick-view-product-details"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', md: 600 },
        maxHeight: '90vh',
        overflow: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 3,
        boxShadow: 24,
        p: 4,
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            {product.title || "Product Details"}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Grid container spacing={3}>
          <Grid>
            <CardMedia
              component="img"
              image={
                product.image_urls && product.image_urls.length > 0
                  ? product.image_urls[0].startsWith("http")
                    ? product.image_urls[0]
                    : `/assets/${product.image_urls[0]}`
                  : "/assets/home.png"
              }
              alt={product.title || "Product image"}
              sx={{ width: '100%', height: 300, objectFit: 'cover', borderRadius: 2 }}
            />
          </Grid>
          <Grid>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {product.description || "No description available"}
            </Typography>
            <Typography variant="h4" color="#EC407A" sx={{ mb: 2 }}>
              {product.price ? `${product.price} JD` : "Price not available"}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <StarRating rating={product.averageRating || 0} />
              <Typography variant="caption" color="text.secondary">
                ({product.ratingsCount || 0} reviews)
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ bgcolor: "#EC407A", "&:hover": { bgcolor: "#d53972" } }}
                >
                  View Details
                </Button>
              </Link>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

const CategoryPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDesc, setCategoryDesc] = useState(""); 
  const [ratings, setRatings] = useState<{ [key: string]: { average: number; count: number } }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.Default);
  const [heroVisible, setHeroVisible] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);

  const user = { id: 1 };

  const CategoryData = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.get(`http://localhost:5000/products/category/${id}`);
      const data = res.data.products || res.data;
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid data format received from server");
      }
      
      setProducts(data);

      if (data?.length > 0) {
        setCategoryName(data[0].category_name || "Unknown Category");
        setCategoryDesc(data[0].category_description || "Shop the best products in this category.");
        
        const prices = data.map(p => p.price || 0);
        const maxProductPrice = Math.max(...prices, 1000);
        setMaxPrice(maxProductPrice);
        setPriceRange([0, maxProductPrice]);
      } else {
        setCategoryName("Category");
        setCategoryDesc("No products found in this category.");
      }

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
        } catch (err) {
          console.error(`Failed to fetch ratings for product ${product.id}:`, err);
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
      console.error("Failed to fetch category data:", err);
      setError("Failed to load products. Please try again later.");
      setCategoryName("");
      setCategoryDesc("");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    CategoryData();
    setHeroVisible(true);
  }, [id]);

  // Get unique brands from products
  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach(p => {
      if (p.brand) brandSet.add(p.brand);
    });
    return Array.from(brandSet);
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Search filter
      const matchesSearch = searchQuery === "" || 
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Price filter
      const price = product.price || 0;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      
      // Brand filter
      const matchesBrand = selectedBrands.length === 0 || 
        (product.brand && selectedBrands.includes(product.brand));
      
      // Rating filter
      const rating = ratings[product.id]?.average || 0;
      const matchesRating = rating >= minRating;
      
      return matchesSearch && matchesPrice && matchesBrand && matchesRating;
    });

    // Sort
    switch (sortOption) {
      case SortOption.PriceAsc:
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case SortOption.PriceDesc:
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case SortOption.TopRated:
        filtered.sort(
          (a, b) => (ratings[b.id]?.average || 0) - (ratings[a.id]?.average || 0)
        );
        break;
      case SortOption.Newest:
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case SortOption.Popular:
        filtered.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
        break;
      default:
        break;
    }
    return filtered;
  }, [products, ratings, sortOption, priceRange, searchQuery, selectedBrands, minRating]);

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = "/assets/home.png";
  };

  const openQuickView = (product: any) => {
    setQuickViewProduct(product);
    setQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setQuickViewOpen(false);
    // Don't set to null immediately to avoid the error
    setTimeout(() => setQuickViewProduct(null), 300);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <Typography variant="h6">Loading products...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section with Animation */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #EC407A 0%, #F48FB1 100%)",
          py: 8,
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Cpath d=\"M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
            animation: "float 20s infinite linear",
          },
          "@keyframes float": {
            "0%": { transform: "translate(0, 0)" },
            "100%": { transform: "translate(-60px, -60px)" },
          },
        }}
      >
        <Container maxWidth="lg">
          <Fade in={heroVisible} timeout={1000}>
            <Box textAlign="center" color="white">
              <Box sx={{ mb: 3, animation: "pulse 2s infinite" }}>
                <ShoppingBagIcon sx={{ fontSize: 60, opacity: 0.9 }} />
              </Box>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: "bold",
                  mb: 2,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.2)",
                  animation: "slideInFromTop 0.8s ease-out",
                }}
              >
                {categoryName}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  maxWidth: "700px",
                  mx: "auto",
                  opacity: 0.95,
                  animation: "slideInFromBottom 0.8s ease-out",
                }}
              >
                {categoryDesc}
              </Typography>
              <Box sx={{ mt: 4 }}>
                <LocalOfferIcon sx={{ fontSize: 30, animation: "bounce 2s infinite" }} />
              </Box>
            </Box>
          </Fade>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ px: 4, py: 6 }}>
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          TransitionComponent={Slide}
        >
          <Alert 
            onClose={() => setError(null)} 
            severity="error" 
            sx={{ width: "100%" }}
            icon={<ErrorOutlineIcon />}
          >
            {error}
          </Alert>
        </Snackbar>
        
        {/* Search Bar */}
        <Box sx={{ mb: 4 }}>
          <TextField
            fullWidth
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                "&:hover fieldset": {
                  borderColor: "#EC407A",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#EC407A",
                },
              },
            }}
          />
        </Box>
        
        {/* Filter and Sort Card */}
        {products.length > 0 && (
          <Card
            sx={{
              mb: 6,
              p: 3,
              background: "linear-gradient(145deg, #ffffff, #f5f5f5)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              borderRadius: 3,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <TuneIcon sx={{ mr: 1, color: "#EC407A" }} />
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                Filters & Sorting
              </Typography>
              <Box sx={{ ml: "auto", display: "flex", gap: 1 }}>
                <IconButton 
                  onClick={() => setViewMode("grid")}
                  color={viewMode === "grid" ? "primary" : "default"}
                >
                  <ViewModuleIcon />
                </IconButton>
                <IconButton 
                  onClick={() => setViewMode("list")}
                  color={viewMode === "list" ? "primary" : "default"}
                >
                  <ViewListIcon />
                </IconButton>
              </Box>
            </Box>
            
            <Grid container spacing={3}>
              <Grid>
                <PriceRangeSlider
                  value={priceRange}
                  onChange={setPriceRange}
                  min={0}
                  max={maxPrice}
                />
              </Grid>
              
              <Grid>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Minimum Rating
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {[0, 1, 2, 3, 4].map((rating) => (
                    <Chip
                      key={rating}
                      label={`${rating}+`}
                      onClick={() => setMinRating(rating)}
                      color={minRating === rating ? "primary" : "default"}
                      variant={minRating === rating ? "filled" : "outlined"}
                      size="small"
                    />
                  ))}
                </Box>
              </Grid>
              
              {brands.length > 0 && (
                <Grid>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Brands
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {brands.map((brand) => (
                      <Chip
                        key={brand}
                        label={brand}
                        onClick={() => {
                          setSelectedBrands(prev => 
                            prev.includes(brand) 
                              ? prev.filter(b => b !== brand)
                              : [...prev, brand]
                          );
                        }}
                        color={selectedBrands.includes(brand) ? "primary" : "default"}
                        variant={selectedBrands.includes(brand) ? "filled" : "outlined"}
                        size="small"
                      />
                    ))}
                  </Box>
                </Grid>
              )}
              
              <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <SortMenu activeSort={sortOption} onSortChange={setSortOption} />
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" color="text.secondary">
                Showing {filteredAndSortedProducts.length} of {products.length} products
              </Typography>
              <Button
                size="small"
                onClick={() => {
                  setSearchQuery("");
                  setPriceRange([0, maxPrice]);
                  setSelectedBrands([]);
                  setMinRating(0);
                  setSortOption(SortOption.Default);
                }}
                sx={{ color: "#EC407A" }}
              >
                Clear All Filters
              </Button>
            </Box>
          </Card>
        )}
        
        {filteredAndSortedProducts.length === 0 && products.length > 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 8 }}>
            <FilterListIcon sx={{ fontSize: 60, color: "#999", mb: 2 }} />
            <Typography variant="h6" color="text.secondary" mb={2}>
              No products found matching your filters.
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => {
                setSearchQuery("");
                setPriceRange([0, maxPrice]);
                setSelectedBrands([]);
                setMinRating(0);
              }}
              sx={{ borderColor: "#EC407A", color: "#EC407A" }}
            >
              Clear All Filters
            </Button>
          </Box>
        ) : products.length === 0 ? (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 8 }}>
            <Typography variant="h6" color="text.secondary" mb={2}>
              No products found in this category.
            </Typography>
            <Link href="/" style={{ textDecoration: "none" }}>
              <Button variant="contained" sx={{ bgcolor: "#EC407A", "&:hover": { bgcolor: "#d53972" } }}>
                Browse Other Categories
              </Button>
            </Link>
          </Box>
        ) : (
          <Grid container spacing={4} justifyContent="center">
            {filteredAndSortedProducts.map((product: any, index) => (
              <Grid 
                key={product.id}
                sx={{ 
                  display: 'flex',
                  justifyContent: 'center',
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                  "@keyframes fadeInUp": {
                    "0%": {
                      opacity: 0,
                      transform: "translateY(30px)",
                    },
                    "100%": {
                      opacity: 1,
                      transform: "translateY(0)",
                    },
                  },
                }}
              >
                <Card
                  sx={(theme) => ({
                    height: "100%",
                    display: "flex",
                    flexDirection: viewMode === "grid" ? "column" : "row",
                    boxShadow: 6,
                    borderRadius: 4,
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    "&:hover": {
                      transform: "translateY(-12px) scale(1.02)",
                      boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
                    },
                    bgcolor: theme.palette.mode === "light" ? "#fff" : "#1e1e1e",
                    maxWidth: viewMode === "grid" ? 380 : "100%",
                    width: "100%",
                  })}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      image={
                        product.image_urls && product.image_urls.length > 0
                          ? product.image_urls[0].startsWith("http")
                            ? product.image_urls[0]
                            : `/assets/${product.image_urls[0]}`
                          : "/assets/home.png"
                      }
                      alt={product.title || "Product image"}
                      sx={{
                        width: viewMode === "grid" ? "100%" : 300,
                        height: viewMode === "grid" ? 220 : "auto",
                        objectFit: "cover",
                        borderTopLeftRadius: 4,
                        borderTopRightRadius: viewMode === "grid" ? 4 : 0,
                        borderBottomLeftRadius: viewMode === "grid" ? 0 : 4,
                      }}
                      onError={handleImageError}
                    />
                    {/* Quick Actions */}
                    <Box sx={{ 
                      position: "absolute", 
                      top: 10, 
                      right: 10, 
                      display: "flex", 
                      flexDirection: "column", 
                      gap: 1 
                    }}>
                      <IconButton 
                        sx={{ 
                          bgcolor: "white", 
                          "&:hover": { bgcolor: "#f5f5f5" },
                          boxShadow: 2
                        }}
                        onClick={() => openQuickView(product)}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Box>
                    {/* Discount Badge */}
                    {product.discount && (
                      <Chip
                        label={`-${product.discount}%`}
                        color="error"
                        size="small"
                        sx={{
                          position: "absolute",
                          top: 10,
                          left: 10,
                          fontWeight: "bold",
                        }}
                      />
                    )}
                  </Box>
                  
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      gutterBottom
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#333",
                        textAlign: viewMode === "grid" ? "center" : "left",
                        minHeight: 56,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: viewMode === "grid" ? "center" : "flex-start",
                      }}
                    >
                      {product.title || "Untitled Product"}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ 
                        mb: 2, 
                        textAlign: viewMode === "grid" ? "center" : "left",
                        minHeight: 48,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: viewMode === "grid" ? "center" : "flex-start",
                      }}
                    >
                      {product.description ? `${product.description.slice(0, 60)}...` : "No description available"}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: "bold",
                        textAlign: viewMode === "grid" ? "center" : "left",
                        color: "#EC407A",
                        mb: 2,
                      }}
                    >
                      {product.price ? `${product.price} JD` : "Price not available"}
                    </Typography>
                    <Box sx={{ mt: 2, textAlign: viewMode === "grid" ? "center" : "left" }}>
                      <StarRating rating={ratings[product.id]?.average || 0} />
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        {ratings[product.id]?.average?.toFixed(1) || 0} ⭐ (
                        {ratings[product.id]?.count || 0})
                      </Typography>
                    </Box>
                  </CardContent>

                  <Box sx={{ p: 3, textAlign: "center", pt: 0 }}>
                    <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        sx={(theme) => ({
                          textTransform: "none",
                          borderRadius: 25,
                          py: 1.5,
                          fontWeight: "bold",
                          fontSize: "1rem",
                          bgcolor: theme.palette.mode === "light" ? "#EC407A" : "#d81b60",
                          "&:hover": {
                            bgcolor: theme.palette.mode === "light" ? "#d53972" : "#ad1457",
                            transform: "scale(1.05)",
                          },
                          transition: "all 0.3s ease",
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
        )}
      </Container>

      {/* Quick View Modal - Only render if product is not null */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          open={quickViewOpen}
          onClose={closeQuickView}
        />
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-10px);
          }
          60% {
            transform: translateY(-5px);
          }
        }
        
        @keyframes slideInFromTop {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInFromBottom {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
};

export default CategoryPage;