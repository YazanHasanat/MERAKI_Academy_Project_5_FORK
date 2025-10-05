"use client";
import { useEffect, useState, useMemo } from "react"; // *** تغيير: تم استيراد useEffect لاستخدامه في SortMenu ***
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
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Popover from "@mui/material/Popover";

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
import RefreshIcon from "@mui/icons-material/Refresh";

const StarRating = ({ rating }: { rating: number }) => {
  rating = Math.min(5, Math.max(0, rating));
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <Box display="flex" alignItems="center" gap={0.25}>
      {[...Array(fullStars)].map((_, i) => (
        <StarIconFull key={`full-${i}`} sx={{ color: "#FFC107", fontSize: 16 }} />
      ))}
      {hasHalfStar && <StarHalfIcon sx={{ color: "#FFC107", fontSize: 16 }} />}
      {[...Array(emptyStars)].map((_, i) => (
        <StarBorderIcon key={`empty-${i}`} sx={{ color: "#FFC107", fontSize: 16 }} />
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

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSortChange = (sort: SortOption) => {
    onSortChange(sort);
    handleClose();
  };

  // *** تغيير: إغلاق القائمة عند التمرير ***
  useEffect(() => {
    const handleScroll = () => {
      if (open) {
        handleClose();
      }
    };

    if (open) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [open, handleClose]);

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<SortIcon />}
        onClick={handleClick}
        sx={{ 
          textTransform: "none",
          bgcolor: "#EC407A",
          color: "white",
          borderRadius: 28,
          px: 3,
          py: 1.2,
          fontWeight: 600,
          boxShadow: "0 4px 12px rgba(236, 64, 122, 0.3)",
          "&:hover": {
            bgcolor: "#d53972",
            boxShadow: "0 6px 16px rgba(236, 64, 122, 0.4)",
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s ease",
        }}
      >
        {currentSortLabel}
      </Button>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        PaperProps={{
          sx: {
            mt: 1.5,
            borderRadius: 2,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            minWidth: 220,
            p: 1,
          }
        }}
      >
        {sortOptions.map((option) => (
          <MenuItem
            key={option.key}
            selected={option.key === activeSort}
            onClick={() => handleSortChange(option.key)}
            sx={{
              borderRadius: 1,
              mx: 0.5,
              my: 0.5,
              "&.Mui-selected": {
                backgroundColor: "rgba(236, 64, 122, 0.08)",
                color: "#EC407A",
                "&:hover": {
                  backgroundColor: "rgba(236, 64, 122, 0.12)",
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit", minWidth: 32 }}>{option.icon}</ListItemIcon>
            <ListItemText primary={option.label} />
          </MenuItem>
        ))}
      </Popover>
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
    <Box sx={{ width: "100%" }}>
      {/* Title */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#333" }}>
          Price Range
        </Typography>
        <Typography variant="subtitle1" color="#EC407A" sx={{ ml: 1, fontWeight: 700 }}>
          (JD)
        </Typography>
      </Box>

      {/* Price Inputs */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 1 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#666", minWidth: 35 }}>
          Min
        </Typography>
        <TextField
          value={value[0]}
          size="small"
          onChange={handleInputChange(0)}
          inputProps={{
            min: 0,
            max: max,
            type: "number",
            style: { textAlign: "center", fontSize: "0.9rem" }
          }}
          sx={{ 
            // *** تغيير: زيادة العرض من 85 إلى 110 بكسل ***
            width: 110, 
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              fontSize: '0.9rem',
              '&:hover fieldset': {
                borderColor: '#EC407A',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#EC407A',
                borderWidth: 2,
              },
              '& input': {
                textAlign: 'center',
                padding: '8px 4px',
              }
            }
          }}
        />
        <Typography variant="body2" sx={{ fontWeight: 600, color: "#666", minWidth: 35 }}>
          Max
        </Typography>
        <TextField
          value={value[1]}
          size="small"
          onChange={handleInputChange(1)}
          inputProps={{
            min: 0,
            max: max,
            type: "number",
            style: { textAlign: "center", fontSize: "0.9rem" }
          }}
          sx={{ 
            // *** تغيير: زيادة العرض من 85 إلى 110 بكسل ***
            width: 110,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              fontSize: '0.9rem',
              '&:hover fieldset': {
                borderColor: '#EC407A',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#EC407A',
                borderWidth: 2,
              },
              '& input': {
                textAlign: 'center',
                padding: '8px 4px',
              }
            }
          }}
        />
      </Box>

      {/* Slider */}
      <Box sx={{ px: 1, py: 2 }}>
        <Slider
          value={value}
          onChange={(_, newValue) => onChange(newValue as [number, number])}
          valueLabelDisplay="auto"
          min={min}
          max={max}
          sx={{
            color: "#EC407A",
            height: 8,
            "& .MuiSlider-thumb": {
              width: 18,
              height: 18,
              backgroundColor: "#fff",
              border: "3px solid #EC407A",
              boxShadow: "0 2px 8px rgba(236, 64, 122, 0.3)",
              "&:hover": {
                boxShadow: "0 3px 12px rgba(236, 64, 122, 0.5)",
                transform: "scale(1.1)",
              },
              "&.Mui-active": {
                boxShadow: "0 3px 12px rgba(236, 64, 122, 0.6)",
              },
            },
            "& .MuiSlider-track": {
              height: 8,
              borderRadius: 4,
              backgroundColor: "#EC407A",
            },
            "& .MuiSlider-rail": {
              height: 8,
              borderRadius: 4,
              backgroundColor: "rgba(0, 0, 0, 0.15)",
            },
            "& .MuiSlider-valueLabel": {
              backgroundColor: "#EC407A",
              borderRadius: 6,
              fontWeight: 600,
              fontSize: "0.7rem",
              padding: "3px 6px",
            },
          }}
        />
      </Box>

      {/* Current Range Display */}
      <Box sx={{ 
        mt: 2, 
        p: 1.5, 
        backgroundColor: "rgba(236, 64, 122, 0.05)", 
        borderRadius: 2,
        border: "1px solid rgba(236, 64, 122, 0.1)"
      }}>
        <Typography variant="body2" sx={{ textAlign: "center", fontWeight: 600, color: "#666" }}>
          Current Range: {value[0]} - {value[1]} JD
        </Typography>
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
          <Grid item xs={12} md={6}>
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
          <Grid item xs={12} md={6}>
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

  const brands = useMemo(() => {
    const brandSet = new Set<string>();
    products.forEach(p => {
      if (p.brand) brandSet.add(p.brand);
    });
    return Array.from(brandSet);
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const matchesSearch = searchQuery === "" || 
        product.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const price = product.price || 0;
      const matchesPrice = price >= priceRange[0] && price <= priceRange[1];
      
      const matchesBrand = selectedBrands.length === 0 || 
        (product.brand && selectedBrands.includes(product.brand));
      
      const rating = ratings[product.id]?.average || 0;
      const matchesRating = rating >= minRating;
      
      return matchesSearch && matchesPrice && matchesBrand && matchesRating;
    });

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
        
        {products.length > 0 && (
          <Box sx={{ display: "flex", gap: 3, mb: 6, alignItems: "flex-start" }}>
            <Paper
              sx={{
                width: 280,
                p: 0,
                borderRadius: 3,
                boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                overflow: "hidden",
                position: "sticky",
                top: 20,
              }}
            >
              <Box sx={{
                p: 3,
                background: "linear-gradient(135deg, #EC407A 0%, #F48FB1 100%)",
                color: "white",
              }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <TuneIcon sx={{ mr: 2, fontSize: 24 }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Filters
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <SortMenu activeSort={sortOption} onSortChange={setSortOption} />
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => {
                      setSearchQuery("");
                      setPriceRange([0, maxPrice]);
                      setSelectedBrands([]);
                      setMinRating(0);
                      setSortOption(SortOption.Default);
                    }}
                    sx={{ 
                      color: "white",
                      fontWeight: 600,
                      textTransform: "none",
                      "&:hover": {
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      },
                    }}
                  >
                    Reset All
                  </Button>
                </Box>
              </Box>

              <Box sx={{ p: 3 }}>
                <Accordion 
                  defaultExpanded 
                  sx={{ 
                    boxShadow: "none", 
                    "&:before": { display: "none" },
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 2,
                    mb: 2,
                  }}
                  // *** تغيير: إضافة هذه الخاصية لإيقاف الحركة عند التمرير ***
                  TransitionProps={{ timeout: 0 }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ 
                      minHeight: 48,
                      "& .MuiAccordionSummary-content": {
                        margin: "12px 0",
                      }
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Price Range
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                    <PriceRangeSlider
                      value={priceRange}
                      onChange={setPriceRange}
                      min={0}
                      max={maxPrice}
                    />
                  </AccordionDetails>
                </Accordion>

                <Accordion 
                  defaultExpanded 
                  sx={{ 
                    boxShadow: "none", 
                    "&:before": { display: "none" },
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 2,
                    mb: 2,
                  }}
                  // *** تغيير: إضافة هذه الخاصية لإيقاف الحركة عند التمرير ***
                  TransitionProps={{ timeout: 0 }}
                >
                  <AccordionSummary 
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ 
                      minHeight: 48,
                      "& .MuiAccordionSummary-content": {
                        margin: "12px 0",
                      }
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Customer Rating
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ pt: 0 }}>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {[4, 3, 2, 1].map((rating) => (
                        <Box
                          key={rating}
                          onClick={() => setMinRating(rating)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            p: 1.5,
                            borderRadius: 2,
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            backgroundColor: minRating === rating ? "rgba(236, 64, 122, 0.08)" : "transparent",
                            "&:hover": {
                              backgroundColor: "rgba(0,0,0,0.04)",
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                sx={{
                                  fontSize: 18,
                                  color: i < rating ? "#FFC107" : "rgba(0,0,0,0.2)",
                                }}
                              />
                            ))}
                          </Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            & Up
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>

                {brands.length > 0 && (
                  <Accordion 
                    defaultExpanded 
                    sx={{ 
                      boxShadow: "none", 
                      "&:before": { display: "none" },
                      border: "1px solid rgba(0,0,0,0.08)",
                      borderRadius: 2,
                    }}
                    // *** تغيير: إضافة هذه الخاصية لإيقاف الحركة عند التمرير ***
                    TransitionProps={{ timeout: 0 }}
                  >
                    <AccordionSummary 
                      expandIcon={<ExpandMoreIcon />}
                      sx={{ 
                        minHeight: 48,
                        "& .MuiAccordionSummary-content": {
                          margin: "12px 0",
                        }
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Brands
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0 }}>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, maxHeight: 200, overflowY: "auto" }}>
                        {brands.map((brand) => (
                          <Box
                            key={brand}
                            onClick={() => {
                              setSelectedBrands(prev => 
                                prev.includes(brand) 
                                  ? prev.filter(b => b !== brand)
                                  : [...prev, brand]
                              );
                            }}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              p: 1,
                              borderRadius: 1,
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              backgroundColor: selectedBrands.includes(brand) ? "rgba(236, 64, 122, 0.08)" : "transparent",
                              "&:hover": {
                                backgroundColor: "rgba(0,0,0,0.04)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: "50%",
                                border: "2px solid #EC407A",
                                backgroundColor: selectedBrands.includes(brand) ? "#EC407A" : "white",
                                mr: 2,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {selectedBrands.includes(brand) && (
                                <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "white" }} />
                              )}
                            </Box>
                            <Typography variant="body2">{brand}</Typography>
                          </Box>
                        ))}
                      </Box>
                    </AccordionDetails>
                  </Accordion>
                )}
              </Box>
            </Paper>

            <Box sx={{ flex: 1 }}>
              <Paper
                sx={{
                  p: 2,
                  mb: 3,
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Showing <Box component="span" sx={{ color: "#EC407A", fontWeight: 700 }}>{filteredAndSortedProducts.length}</Box> of{" "}
                  <Box component="span" sx={{ fontWeight: 700 }}>{products.length}</Box> products
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5, bgcolor: "rgba(0,0,0,0.04)", p: 0.5, borderRadius: 2 }}>
                  <IconButton 
                    onClick={() => setViewMode("grid")}
                    color={viewMode === "grid" ? "primary" : "default"}
                    sx={{ 
                      borderRadius: 1.5,
                      bgcolor: viewMode === "grid" ? "#EC407A" : "transparent",
                      color: viewMode === "grid" ? "white" : "text.secondary",
                      "&:hover": {
                        bgcolor: viewMode === "grid" ? "#d53972" : "rgba(0,0,0,0.04)",
                      }
                    }}
                  >
                    <ViewModuleIcon fontSize="small" />
                  </IconButton>
                  <IconButton 
                    onClick={() => setViewMode("list")}
                    color={viewMode === "list" ? "primary" : "default"}
                    sx={{ 
                      borderRadius: 1.5,
                      bgcolor: viewMode === "list" ? "#EC407A" : "transparent",
                      color: viewMode === "list" ? "white" : "text.secondary",
                      "&:hover": {
                        bgcolor: viewMode === "list" ? "#d53972" : "rgba(0,0,0,0.04)",
                      }
                    }}
                  >
                    <ViewListIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>

              {filteredAndSortedProducts.length === 0 ? (
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
              ) : (
                <Grid container spacing={3}>
                  {filteredAndSortedProducts.map((product: any, index) => (
                    <Grid 
                      item 
                      key={product.id}
                      xs={12} sm={6} md={4} lg={3}
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
                          flexDirection: "column",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          borderRadius: 3,
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          border: "1px solid rgba(0,0,0,0.06)",
                          position: "relative",
                          overflow: "hidden",
                          "&:hover": {
                            transform: "translateY(-6px)",
                            boxShadow: "0 12px 28px rgba(0,0,0,0.15)",
                            "& .product-image": {
                              transform: "scale(1.05)",
                            },
                            "& .quick-actions": {
                              opacity: 1,
                              transform: "translateX(0)",
                            },
                          },
                          bgcolor: theme.palette.mode === "light" ? "#fff" : "#1e1e1e",
                          width: "100%",
                          maxWidth: 300,
                        })}
                      >
                        <Box sx={{ 
                          position: "relative", 
                          overflow: "hidden",
                          height: 280,
                          backgroundColor: "#f8f9fa",
                        }}>
                          <CardMedia
                            component="img"
                            className="product-image"
                            image={
                              product.image_urls && product.image_urls.length > 0
                                ? product.image_urls[0].startsWith("http")
                                  ? product.image_urls[0]
                                  : `/assets/${product.image_urls[0]}`
                                : "/assets/home.png"
                            }
                            alt={product.title || "Product image"}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              transition: "transform 0.5s ease",
                            }}
                            onError={handleImageError}
                          />
                          
                          {product.discount && (
                            <Chip
                              label={`-${product.discount}%`}
                              color="error"
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 12,
                                left: 12,
                                fontWeight: 700,
                                fontSize: "0.75rem",
                                height: 28,
                                borderRadius: 14,
                                zIndex: 2,
                              }}
                            />
                          )}

                          <Box 
                            className="quick-actions"
                            sx={{ 
                              position: "absolute", 
                              top: 12, 
                              right: 12, 
                              display: "flex", 
                              flexDirection: "column", 
                              gap: 1,
                              opacity: 0,
                              transform: "translateX(20px)",
                              transition: "all 0.3s ease",
                              zIndex: 2,
                            }}
                          >
                            <IconButton 
                              sx={{ 
                                bgcolor: "white", 
                                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                                "&:hover": { 
                                  bgcolor: "#EC407A",
                                  color: "white",
                                  transform: "scale(1.1)",
                                },
                                transition: "all 0.2s ease",
                              }}
                              onClick={() => openQuickView(product)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                        
                        <CardContent sx={{ 
                          flexGrow: 1, 
                          p: 2.5,
                          display: "flex",
                          flexDirection: "column",
                        }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              color: "#212529",
                              fontSize: "1rem",
                              lineHeight: 1.4,
                              mb: 1,
                              height: 56,
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {product.title || "Untitled Product"}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ 
                              mb: 2,
                              fontSize: "0.875rem",
                              lineHeight: 1.5,
                              height: 42,
                              overflow: "hidden",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                            }}
                          >
                            {product.description || "No description available"}
                          </Typography>

                          <Box sx={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: 1,
                            mb: 2,
                          }}>
                            <StarRating rating={ratings[product.id]?.average || 0} />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{ fontWeight: 500 }}
                            >
                              ({ratings[product.id]?.count || 0})
                            </Typography>
                          </Box>

                          <Box sx={{ 
                            mt: "auto",
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                          }}>
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 700,
                                color: "#EC407A",
                                fontSize: "1.5rem",
                              }}
                            >
                              {product.price ? `${product.price} JD` : "Price not available"}
                            </Typography>
                            
                            <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
                              <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                  textTransform: "none",
                                  borderRadius: 2.5,
                                  py: 1.2,
                                  fontWeight: 600,
                                  fontSize: "0.95rem",
                                  bgcolor: "#EC407A",
                                  color: "white",
                                  boxShadow: "0 2px 8px rgba(236, 64, 122, 0.3)",
                                  "&:hover": {
                                    bgcolor: "#d53972",
                                    boxShadow: "0 4px 12px rgba(236, 64, 122, 0.4)",
                                    transform: "translateY(-1px)",
                                  },
                                  transition: "all 0.2s ease",
                                }}
                              >
                                View Details
                              </Button>
                            </Link>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Box>
        )}
        
        {products.length === 0 && (
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
        )}
      </Container>

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