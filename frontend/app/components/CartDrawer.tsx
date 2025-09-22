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

export default function CartDrawer({ open, onClose }: CartDrawerProps) {
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
    if (open) {
      getcart();
    }
  }, [open]);

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
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
    <>
      <Drawer anchor="right" open={open} onClose={onClose}>
        <Box
          sx={{
            width: 350,
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">Your Cart</Typography>
            <Button onClick={onClose} sx={{ textTransform: "none" }}>
              Close
            </Button>
          </Box>
          <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
            {loading ? (
              <Typography>Loading...</Typography>
            ) : cart.length === 0 ? (
              <Typography variant="body1">Cart is empty</Typography>
            ) : (
              cart.map((item) => (
                <Box
                  key={item.product_id}
                  sx={{
                    mb: 2,
                    p: 1,
                    borderBottom: "1px solid #eee",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      component="img"
                      src={`/assets/${item.image_urls[0]}`}
                      alt={item.title}
                      sx={{ width: 60, height: 60, borderRadius: 2, mr: 2 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1">{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.quantity} × ${item.price}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        minWidth: 60,
                        textAlign: "right",
                      }}
                    >
                      ${(item.quantity * item.price).toFixed(2)}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mt: 1,
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        border: "1px solid #ccc",
                        borderRadius: "50px",
                        px: 1.5,
                        py: 0.5,
                        gap: 1.5,
                      }}
                    >
                      <Button
                        variant="text"
                        size="small"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product_id,
                            item.quantity - 1
                          )
                        }
                      >
                        −
                      </Button>
                      <Typography>{item.quantity}</Typography>
                      <Button
                        variant="text"
                        size="small"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product_id,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </Button>
                    </Box>

                    <Button
                      variant="text"
                      color="error"
                      size="small"
                      onClick={() => handleDeleteItem(item.product_id)}
                    >
                      🗑️
                    </Button>
                  </Box>
                </Box>
              ))
            )}
          </Box>

          {cart.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2, textAlign: "right", fontWeight: "bold" }}
              >
                Total: ${total.toFixed(2)}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleDialogOpen}
                fullWidth
              >
                Add Location
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{ mt: 1 }}
                fullWidth
                onClick={() => {
                  router.push("/checkout");
                  onClose();
                }}
              >
                Proceed to Checkout
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>

      {/* Location Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleDialogClose}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Location</DialogTitle>
        <DialogContent dividers>
          <GetAddress onClose={handleDialogClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
