"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { useTheme, useMediaQuery } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GetAddress from "../components/addres";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CartItem {
  product_id: number;
  quantity: number;
  title: string;
  price: number;
  image_urls: string[];
}

export default function CartPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const router = useRouter();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const getcart = async () => {
    try {
      setLoading(true);
      const result = await axios.get("https://meraki-academy-project-5-xtxg.onrender.com/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCart(result.data.products || []);
    } catch (err: any) {
      console.error("Error fetching cart:", err.message);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    getcart();
  }, []);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handleDeleteItem = async (product_id: number) => {
    try {
      await axios.delete(`https://meraki-academy-project-5-xtxg.onrender.com/cart/item/${product_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      await getcart();
    } catch (err: any) {
      console.error("Error deleting item:", err.message);
    }
  };

  const handleUpdateQuantity = async (product_id: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await axios.put(
        "https://meraki-academy-project-5-xtxg.onrender.com/cart/update",
        { product_id, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      await getcart();
    } catch (err: any) {
      console.error("Error updating quantity:", err.message);
    }
  };

  return (
    <Box sx={{ 
      display: "flex", 
      flexDirection: isMobile ? "column" : "row",
      p: isMobile ? 2 : 3, 
      gap: 3,
      maxWidth: "1200px",
      mx: "auto",
      backgroundColor: "#f9f9f9",
      minHeight: "100vh"
    }}>
      <Box sx={{ flex: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Badge badgeContent={cart.length} color="primary" sx={{ mr: 2 }}>
            <ShoppingCartIcon sx={{ fontSize: 32 }} />
          </Badge>
          <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "bold" }}>
            Your Shopping Cart
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Loading...
            </Typography>
          </Box>
        ) : cart.length === 0 ? (
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, 
              textAlign: "center", 
              borderRadius: 3,
              backgroundColor: "white",
              border: "1px dashed #ccc"
            }}
          >
            <ShoppingCartIcon sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Your cart is empty
            </Typography>
            <Button 
              variant="contained" 
              sx={{ mt: 2 }}
              onClick={() => router.push("/")}
            >
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Box>
            {cart.map((item) => (
              <Paper
                key={item.product_id}
                elevation={2}
                sx={{
                  mb: 2,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  borderRadius: 3,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: 4,
                  },
                  gap: 2,
                }}
              >
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
                    width: isMobile ? 60 : 80, 
                    height: isMobile ? 60 : 80, 
                    borderRadius: 2,
                    objectFit: "cover"
                  }}
                />

                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    flexDirection: isMobile ? "column" : "row",
                    alignItems: isMobile ? "flex-start" : "center",
                    justifyContent: "space-between",
                    gap: isMobile ? 1 : 0,
                  }}
                >
                  <Typography variant={isMobile ? "body1" : "h6"} sx={{ fontWeight: "medium" }}>
                    {item.title}
                  </Typography>

                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #e0e0e0",
                        borderRadius: "50px",
                        px: 1,
                        py: 0.5,
                        gap: 0.5,
                        backgroundColor: "#f5f5f5",
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleUpdateQuantity(item.product_id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>

                      <Typography sx={{ minWidth: "20px", textAlign: "center" }}>
                        {item.quantity}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={() =>
                          handleUpdateQuantity(item.product_id, item.quantity + 1)
                        }
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDeleteItem(item.product_id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>

                <Typography
                  variant={isMobile ? "body1" : "h6"}
                  sx={{ 
                    fontWeight: "bold", 
                    minWidth: isMobile ? 70 : 80, 
                    textAlign: "right",
                    color: "primary.main"
                  }}
                >
                  ${(item.quantity * item.price).toFixed(2)}
                </Typography>
              </Paper>
            ))}

            <Divider sx={{ my: 2 }} />

            <Box sx={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center",
              p: 2,
              backgroundColor: "white",
              borderRadius: 3,
              boxShadow: 1
            }}>
              <Typography variant="h6">Subtotal</Typography>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
                ${total.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        )}
      </Box>

      <Box sx={{ flex: 1 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            position: isMobile ? "relative" : "sticky",
            top: isMobile ? 0 : 20,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
            Order Summary
          </Typography>
          
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Subtotal</Typography>
              <Typography variant="body2">${total.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Shipping</Typography>
              <Typography variant="body2">Calculated at checkout</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
                ${total.toFixed(2)}
              </Typography>
            </Box>
          </Box>

          <Button
            variant="contained"
            startIcon={<LocationOnIcon />}
            onClick={handleDialogOpen}
            fullWidth
            sx={{ 
              mb: 2, 
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold"
            }}
          >
            Add Location
          </Button>

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => router.push("/checkout")}
            sx={{ 
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold"
            }}
          >
            Proceed to Checkout
          </Button>
        </Paper>
      </Box>

      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>Enter Your Location</DialogTitle>
        <DialogContent dividers>
          <GetAddress onClose={handleDialogClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}