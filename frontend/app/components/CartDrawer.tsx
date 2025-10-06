"use client";

import * as React from "react";
import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import GetAddress from "./addres";
import axios from "axios";
import { useRouter } from "next/navigation";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CircularProgress from "@mui/material/CircularProgress";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

interface CartItem {
  product_id: number;
  quantity: number;
  title: string;
  price: number;
  image_urls: string[];
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
  const router = useRouter();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [updatingItems, setUpdatingItems] = React.useState<Set<number>>(new Set());
  const [myLocation, setMyLocation] = React.useState<any>(null);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState("");

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  // دالة للتحقق من تسجيل الدخول
  const checkLoginStatus = () => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    return !!token;
  };

  const getcart = async () => {
    // التحقق من تسجيل الدخول قبل إرسال الطلب
    if (!checkLoginStatus()) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);
      const result = await axios.get("http://localhost:5000/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(result.data.products || []);
    } catch (err: any) {
      // تجنب عرض الخطأ في الكونسول إذا كان الخطأ بسبب عدم تسجيل الدخول أو عدم وجود سلة
      if (err.response?.status !== 401 && err.response?.status !== 403 && err.response?.status !== 404) {
        console.error("Error fetching cart:", err.message);
      }
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const getLocationById = async () => {
    // التحقق من تسجيل الدخول قبل إرسال الطلب
    if (!checkLoginStatus()) {
      setMyLocation(null);
      return;
    }

    try {
      const result = await axios.get("http://localhost:5000/location", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (result.data.location) {
        setMyLocation(result.data.location);
      } else {
        setMyLocation(null);
      }
    } catch (err: any) {
      // تجنب عرض الخطأ في الكونسول إذا كان الخطأ بسبب عدم تسجيل الدخول أو عدم وجود موقع
      if (err.response?.status !== 401 && err.response?.status !== 403 && err.response?.status !== 404) {
        console.error("Error fetching location:", err);
      }
      setMyLocation(null);
    }
  };

  React.useEffect(() => {
    if (open) {
      checkLoginStatus();
      getcart();
    }
  }, [open]);

  React.useEffect(() => {
    checkLoginStatus();
    getLocationById();
  }, []);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleDeleteItem = async (product_id: number) => {
    // التحقق من تسجيل الدخول قبل إرسال الطلب
    if (!checkLoginStatus()) {
      setSnackbarMessage("Please login to manage your cart");
      setSnackbarOpen(true);
      return;
    }

    try {
      // تحديث الحالة محلياً فوراً
      setCart(prevCart => prevCart.filter(item => item.product_id !== product_id));
      
      await axios.delete(`http://localhost:5000/cart/item/${product_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (err: any) {
      // تجنب عرض الخطأ في الكونسول إذا كان الخطأ بسبب عدم تسجيل الدخول أو عدم وجود المنتج
      if (err.response?.status !== 401 && err.response?.status !== 403 && err.response?.status !== 404) {
        console.error("Error deleting item:", err.message);
      }
      // في حالة الخطأ، أعد جلب البيانات
      getcart();
    }
  };

  const handleUpdateQuantity = async (product_id: number, quantity: number) => {
    if (quantity < 1) return;
    
    // التحقق من تسجيل الدخول قبل إرسال الطلب
    if (!checkLoginStatus()) {
      setSnackbarMessage("Please login to manage your cart");
      setSnackbarOpen(true);
      return;
    }
    
    try {
      // إضافة المنتج إلى قائمة التحديث
      setUpdatingItems(prev => new Set(prev).add(product_id));
      
      // تحديث الحالة محلياً فوراً
      setCart(prevCart => 
        prevCart.map(item => 
          item.product_id === product_id ? { ...item, quantity } : item
        )
      );
      
      await axios.put(
        "http://localhost:5000/cart/update",
        { product_id, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (err: any) {
      // تجنب عرض الخطأ في الكونسول إذا كان الخطأ بسبب عدم تسجيل الدخول أو عدم وجود المنتج
      if (err.response?.status !== 401 && err.response?.status !== 403 && err.response?.status !== 404) {
        console.error("Error updating quantity:", err.message);
      }
      // في حالة الخطأ، أعد جلب البيانات
      getcart();
    } finally {
      // إزالة المنتج من قائمة التحديث
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product_id);
        return newSet;
      });
    }
  };

  const handleProceedToCheckout = () => {
    if (!isLoggedIn) {
      setSnackbarMessage("Please login to proceed to checkout");
      setSnackbarOpen(true);
      return;
    }
    
    if (!myLocation) {
      setSnackbarMessage("Please add a location before proceeding to checkout");
      setSnackbarOpen(true);
      return;
    }
    
    router.push("/checkout");
    onClose();
  };

  const handleDialogCloseAndRefresh = () => {
    handleDialogClose();
    getLocationById();
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: 400 },
            borderTopLeftRadius: { xs: 0, sm: 16 },
            borderBottomLeftRadius: { xs: 0, sm: 16 },
          },
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            bgcolor: "#f9f9f9",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: "white",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ShoppingBagIcon sx={{ mr: 1, color: "#EC407A" }} />
              <Typography variant="h6" fontWeight="bold">
                Your Cart
              </Typography>
            </Box>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Cart Items */}
          <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
            {!isLoggedIn ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 8,
                }}
              >
                <ShoppingBagIcon
                  sx={{ fontSize: 64, color: "#ccc", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  Please login to view your cart
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Login to add products to your cart
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2, bgcolor: "#EC407A" }}
                  onClick={() => {
                    onClose();
                    router.push("/login");
                  }}
                >
                  Login
                </Button>
              </Box>
            ) : loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <Typography>Loading...</Typography>
              </Box>
            ) : cart.length === 0 ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  py: 8,
                }}
              >
                <ShoppingBagIcon
                  sx={{ fontSize: 64, color: "#ccc", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary">
                  Your cart is empty
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Add some products to get started
                </Typography>
                <Button
                  variant="contained"
                  sx={{ mt: 2, bgcolor: "#EC407A" }}
                  onClick={() => {
                    onClose();
                    router.push("/category/1");
                  }}
                >
                  Browse Products
                </Button>
              </Box>
            ) : (
              cart.map((item) => (
                <Box
                  key={`cart-item-${item.product_id}`}
                  sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: "white",
                    borderRadius: 2,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                    <Box
                      component="img"
                      src={
                        item.image_urls?.[0]
                          ? item.image_urls[0].startsWith("http")
                            ? item.image_urls[0]
                            : `/assets/${item.image_urls[0]}`
                          : "/assets/home.png"
                      }
                      alt={item.title}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        objectFit: "cover",
                        mr: 2,
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 0.5 }}
                      >
                        ${item.price} each
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          fontWeight: "bold",
                          mt: 1,
                          color: "#EC407A",
                        }}
                      >
                        ${(item.quantity * item.price).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 2,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        bgcolor: "#f5f5f5",
                        borderRadius: "50px",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product_id,
                            item.quantity - 1
                          )
                        }
                        disabled={item.quantity <= 1 || updatingItems.has(item.product_id)}
                        sx={{
                          color: item.quantity <= 1 || updatingItems.has(item.product_id) ? "#ccc" : "#EC407A",
                        }}
                      >
                        {updatingItems.has(item.product_id) ? (
                          <CircularProgress size={16} />
                        ) : (
                          <RemoveIcon fontSize="small" />
                        )}
                      </IconButton>
                      <Typography
                        variant="body1"
                        sx={{ minWidth: 30, textAlign: "center" }}
                      >
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product_id,
                            item.quantity + 1
                          )
                        }
                        disabled={updatingItems.has(item.product_id)}
                        sx={{ color: updatingItems.has(item.product_id) ? "#ccc" : "#EC407A" }}
                      >
                        {updatingItems.has(item.product_id) ? (
                          <CircularProgress size={16} />
                        ) : (
                          <AddIcon fontSize="small" />
                        )}
                      </IconButton>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={() => handleDeleteItem(item.product_id)}
                      sx={{ color: "#E53935" }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {/* Footer */}
          {isLoggedIn && cart.length > 0 && (
            <>
              <Divider />
              <Box sx={{ p: 2, bgcolor: "white" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" fontWeight="bold" color="#EC407A">
                    ${total.toFixed(2)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<LocationOnIcon />}
                  onClick={handleDialogOpen}
                  fullWidth
                  sx={{
                    py: 1.5,
                    mb: 1,
                    bgcolor: "#f5f5f5",
                    color: "#333",
                    fontWeight: "bold",
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "#e0e0e0",
                    },
                  }}
                >
                  {myLocation ? "Change Location" : "Add Location"}
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleProceedToCheckout}
                  sx={{
                    py: 1.5,
                    bgcolor: "#EC407A",
                    color: "white",
                    fontWeight: "bold",
                    borderRadius: 2,
                    boxShadow: "0 4px 8px rgba(236, 64, 122, 0.3)",
                    "&:hover": {
                      bgcolor: "#D81B60",
                      boxShadow: "0 6px 12px rgba(236, 64, 122, 0.4)",
                    },
                  }}
                >
                  Proceed to Checkout
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      {/* Location Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogCloseAndRefresh}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: 3 },
        }}
      >
        <DialogTitle
          sx={{
            bgcolor: "#EC407A",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Delivery Location
        </DialogTitle>
        <DialogContent dividers>
          <GetAddress onClose={handleDialogCloseAndRefresh} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCloseAndRefresh}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="warning"
          sx={{ backgroundColor: "#EC407A", color: "white" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
}