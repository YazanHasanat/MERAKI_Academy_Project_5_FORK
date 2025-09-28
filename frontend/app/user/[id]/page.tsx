"use client";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Stack,
  TextField,
  Typography,
  Chip,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

type UserType = {
  id: number;
  firstname: string;
  lastname: string;
  country: string;
  email: string;
  password: string;
  age: number;
  role_id?: number;
};

type OrderType = {
  id: number;
  created_at: string;
  total_price?: number;
  status: string;
  pay_method: string;
  products: any;
  address: string;
};
const statusMap: {
  [key: string]: {
    label: string;
    color: "warning" | "info" | "success" | "default";
  };
} = {
  pending: { label: "Pending", color: "warning" },
  preparing: { label: "Preparing", color: "info" },
  "on the way": { label: "On the Way", color: "info" },
  delivered: { label: "Delivered", color: "success" },
};

const UserPage = () => {
  const [user, setUser] = useState<UserType[]>([]);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    country: "",
    email: "",
  });

  const getInformation = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users/mypage", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const getOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders/userorders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (Array.isArray(res.data)) {
        setOrders(res.data);
      } else if (Array.isArray(res.data.orders)) {
        setOrders(res.data.orders);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    getInformation();
    getOrders();
  }, []);

  const handleOpenUpdate = (user: UserType) => {
    setSelectedUser(user);
    setFormData({
      firstname: user.firstname,
      lastname: user.lastname,
      country: user.country,
      email: user.email,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    try {
      await axios.put(
        `http://localhost:5000/users/${selectedUser.id}`,
        {
          firstName: formData.firstname,
          lastName: formData.lastname,
          country: formData.country,
          email: formData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      handleClose();
      getInformation();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const userAvatar = localStorage.getItem("avatar") || "/avatar.png";
  console.log(orders);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 5,
        backgroundColor: "#fafafa",
      }}
    >
      <Stack spacing={3} sx={{ width: 700 }}>
        {/* User Info */}
        {user.map((ele) => (
          <Card
            key={ele.id}
            sx={{ borderRadius: 4, boxShadow: 6, p: 2, bgcolor: "white" }}
          >
            <CardContent>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar
                  src={userAvatar}
                  alt="Profile"
                  sx={{ width: 72, height: 72, border: "2px solid #f06292" }}
                />
                <Box>
                  <Typography variant="h6" color="black">
                    {ele.firstname} {ele.lastname}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    {ele.email}
                  </Typography>
                  <Typography variant="body2" color="gray">
                    {ele.country}
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={() => handleOpenUpdate(ele)}
                  sx={{
                    backgroundColor: "#f06292",
                    borderRadius: 2,
                    textTransform: "none",
                    px: 3,
                    "&:hover": { backgroundColor: "#d81b60" },
                  }}
                >
                  Update Profile
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {/* Order History */}
        <Card sx={{ borderRadius: 4, boxShadow: 6, p: 2, bgcolor: "white" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom color="black">
              Order History
            </Typography>

            {orders.length > 0 ? (
              <Stack spacing={2}>
                {orders.map((order) => (
                  <Card
                    key={order.id}
                    sx={{
                      borderRadius: 3,
                      boxShadow: 2,
                      p: 2,
                      bgcolor: "#f9f9f9",
                    }}
                  >
                    <Stack spacing={1}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body1" fontWeight="bold">
                          Order #{order.id}
                        </Typography>
                        <Chip
                          label={statusMap[order.status]?.label || order.status}
                          size="small"
                          sx={{
                            backgroundColor:
                              order.status === "pending"
                                ? "#ff9800"
                                : order.status === "preparing"
                                ? "#2196f3"
                                : order.status === "on the way"
                                ? "#ba68c8"
                                : order.status === "delivered"
                                ? "#4caf50"
                                : "#e0e0e0",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        />
                      </Stack>

                      <Grid container spacing={2}>
                        <Grid>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <CalendarTodayIcon sx={{ fontSize: 18 }} />
                            <Typography variant="body2" color="gray">
                              {new Date(order.created_at).toLocaleDateString(
                                "en-GB"
                              )}
                            </Typography>
                          </Stack>
                        </Grid>

                        <Grid>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <PaymentIcon sx={{ fontSize: 18 }} />
                            <Typography variant="body2" color="gray">
                              {order.pay_method}
                            </Typography>
                          </Stack>
                        </Grid>

                        <Grid>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <ShoppingCartIcon sx={{ fontSize: 18 }} />
                            <Typography variant="body2" color="gray">
                              {order.products?.length || 0} Products
                            </Typography>
                          </Stack>
                        </Grid>

                        <Grid>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <LocationOnIcon sx={{ fontSize: 18 }} />
                            <Typography variant="body2" color="gray">
                              {order.address}
                            </Typography>
                          </Stack>
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 1 }} />

                      <Typography variant="body2" fontWeight="bold">
                        Total: ${order.total_price || 0}
                      </Typography>
                    </Stack>
                  </Card>
                ))}
              </Stack>
            ) : (
              <Typography variant="body2" color="gray">
                No orders found.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Stack>

      {/* Dialog for Update */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="First Name"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{
              backgroundColor: "#f06292",
              "&:hover": { backgroundColor: "#d81b60" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPage;
