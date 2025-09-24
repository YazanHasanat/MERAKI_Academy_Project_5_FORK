"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
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
  const router = useRouter();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [cart, setCart] = React.useState<CartItem[]>([]);
  const [loading, setLoading] = React.useState(false);

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const getcart = async () => {
    try {
      setLoading(true);
      const result = await axios.get("http://localhost:5000/cart", {
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

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleDeleteItem = async (product_id: number) => {
    try {
      await axios.delete(`http://localhost:5000/cart/item/${product_id}`, {
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
        "http://localhost:5000/cart/update",
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
    <Box sx={{ display: "flex", p: 3, gap: 3 }}>
      <Box sx={{ flex: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
          Your Shopping Cart
        </Typography>

        {loading ? (
          <Typography variant="h6" color="text.secondary">Loading...</Typography>
        ) : cart.length === 0 ? (
          <Typography variant="h6" color="text.secondary">Your cart is empty</Typography>
        ) : (
          cart.map((item) => (
            <Box
              key={item.product_id}
              sx={{
                mb: 3,
                p: 2,
                display: "flex",
                alignItems: "center",
                borderBottom: "1px solid #ddd",
                borderRadius: 2,
                boxShadow: 1,
                gap: 2,
              }}
            >
              <Box
                component="img"
                src={`/assets/${item.image_urls[0]}`}
                alt={item.title}
                sx={{ width: 80, height: 80, borderRadius: 2 }}
              />

              <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography variant="h6">{item.title}</Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #ccc",
                        borderRadius: "50px",
                        px: 1.5,
                        py: 0.5,
                        gap: 1.5,
                      }}>
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                  >−</Button>

                  <Typography>{item.quantity}</Typography>

                  <Button
                    variant="text"
                    size="small"
                    onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                  >+</Button>
                    </Box>
                  <Button
                    variant="text"
                    color="error"
                    size="small"
                    onClick={() => handleDeleteItem(item.product_id)}
                  >🗑️</Button>
                </Box>
              </Box>

              <Typography variant="body1" sx={{ fontWeight: "bold", minWidth: 80, textAlign: "right" }}>
                ${(item.quantity * item.price).toFixed(2)}
              </Typography>
            </Box>
          ))
        )}

        {cart.length > 0 && (
          <Box sx={{ mt: 3, textAlign: "right" }}>
            <Typography variant="h5" sx={{ fontWeight: "bold", color: "primary.main" }}>
              Total: ${total.toFixed(2)}
            </Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ flex: 1 }}>
        <Box
          sx={{
            p: 3,
            border: "1px solid #ddd",
            borderRadius: 2,
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Complete Your Purchase
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            To complete your purchase, please enter your location.
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleDialogOpen}
            fullWidth
            sx={{ mb: 2 }}
          >
            Add Location
          </Button>

          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => router.push("/checkout")}
          >
            Proceed to Checkout
          </Button>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={handleDialogClose} fullWidth maxWidth="md">
        <DialogTitle>Enter Your Location</DialogTitle>
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
