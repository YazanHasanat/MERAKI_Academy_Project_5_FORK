"use client";
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
  Paper,
  IconButton,
  useTheme,
  alpha,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PaymentIcon from "@mui/icons-material/Payment";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";

type UserType = {
  id: number;
  firstname: string;
  lastname: string;
  country: string;
  email: string;
  password: string;
  age: number;
  role_id?: number;
  created_at: string;
  avatar?: string;
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

const statusMap: { [key: string]: { label: string; color: string } } = {
  pending: { label: "pending", color: "#ff9800" },
  preparing: { label: "Preparing", color: "#2196f3" },
  "on the way": { label: "on the way", color: "#ba68c8" },
  delivered: { label: "completed", color: "#4caf50" },
};

const UserPage = () => {
  const theme = useTheme();
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
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  const getOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders/userorders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (Array.isArray(res.data)) setOrders(res.data);
      else if (Array.isArray(res.data.orders)) setOrders(res.data.orders);
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
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const currentUserId = Number(localStorage.getItem("userId"));

      if (selectedUser.id === currentUserId) {
        localStorage.setItem("firstName", formData.firstname);
      }
      window.dispatchEvent(new Event("storageUpdate"));
      handleClose();
      getInformation();
    } catch (err) {
      console.error("Error updating user:", err);
    }
  };

  const handleAvatarChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    user: UserType
  ) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", "tecknest");
    formDataCloud.append("cloud_name", "dv2a5welg");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dv2a5welg/image/upload",
        formDataCloud
      );

      const uploadedUrl = response.data.secure_url;

      await axios.put(
        `http://localhost:5000/users/avatar/${user.id}`,
        { avatar: uploadedUrl },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      console.log("Avatar updated successfully ✅");

      setUser((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, avatar: uploadedUrl } : u))
      );
    } catch (err) {
      console.error("Error uploading avatar:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
        px: { xs: 2, md: 4 },
        background: `linear-gradient(135deg, ${alpha(
          theme.palette.primary.main,
          0.05
        )} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4}>
          {/* Profile Section */}
          <Paper
            elevation={4}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              background: "white",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: "white",
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                My Profile
              </Typography>
            </Box>
            <Box sx={{ p: 4 }}>
              {user.map((ele) => (
                <Stack
                  key={ele.id}
                  direction={{ xs: "column", md: "row" }}
                  spacing={4}
                  alignItems="center"
                >
                  <Box sx={{ position: "relative" }}>
                    <Avatar
                      src={ele.avatar || undefined}
                      sx={{
                        width: 120,
                        height: 120,
                        border: "4px solid",
                        borderColor: "primary.main",
                        bgcolor: ele.avatar ? "transparent" : "primary.main",
                        color: "white",
                        fontSize: 48,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      }}
                    >
                      {!ele.avatar && ele.firstname.charAt(0).toUpperCase()}
                    </Avatar>
                    <IconButton
                      component="label"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        bgcolor: "primary.main",
                        color: "white",
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
                        "&:hover": {
                          bgcolor: "primary.dark",
                        },
                      }}
                    >
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) => handleAvatarChange(e, ele)}
                      />
                      <PhotoCameraIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="text.primary"
                      mb={1}
                    >
                      {ele.firstname} {ele.lastname}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={2}>
                      {ele.email}
                    </Typography>
                    <Stack direction="row" spacing={3} mb={2}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Age
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {ele.age}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Country
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {ele.country}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Member Since
                        </Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {new Date(ele.created_at).toLocaleDateString("en-GB")}
                        </Typography>
                      </Box>
                    </Stack>
                    <Button
                      variant="contained"
                      startIcon={<EditIcon />}
                      onClick={() => handleOpenUpdate(ele)}
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        px: 3,
                        py: 1,
                        fontWeight: "bold",
                      }}
                    >
                      Edit Profile
                    </Button>
                  </Box>
                </Stack>
              ))}
            </Box>
          </Paper>

          {/* Order History Section */}
          <Paper
            elevation={4}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              background: "white",
              boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
            }}
          >
            <Box
              sx={{
                p: 3,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                color: "white",
              }}
            >
              <Typography variant="h5" fontWeight="bold">
                Order History
              </Typography>
            </Box>
            <Box sx={{ p: 4 }}>
              {orders.length > 0 ? (
                <Stack spacing={3}>
                  {orders.map((order) => (
                    <Card
                      key={order.id}
                      elevation={2}
                      sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
                        },
                      }}
                    >
                      <Box sx={{ p: 3 }}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={2}
                        >
                          <Typography variant="h6" fontWeight="bold">
                            Order #{order.id}
                          </Typography>
                          <Chip
                            label={
                              statusMap[order.status]?.label || order.status
                            }
                            size="medium"
                            sx={{
                              backgroundColor:
                                statusMap[order.status]?.color || "#e0e0e0",
                              color: "white",
                              fontWeight: "bold",
                            }}
                          />
                        </Stack>

                        <Grid container spacing={3} mb={2}>
                          <Grid>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <CalendarTodayIcon
                                fontSize="small"
                                color="action"
                              />
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Date
                                </Typography>
                                <Typography variant="body2">
                                  {new Date(
                                    order.created_at
                                  ).toLocaleDateString("en-GB")}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>
                          <Grid>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <PaymentIcon fontSize="small" color="action" />
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Payment
                                </Typography>
                                <Typography variant="body2">
                                  {order.pay_method}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>
                          <Grid>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <ShoppingCartIcon
                                fontSize="small"
                                color="action"
                              />
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Products
                                </Typography>
                                <Typography variant="body2">
                                  {order.products?.length || 0}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>
                          <Grid>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                            >
                              <LocationOnIcon fontSize="small" color="action" />
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                >
                                  Address
                                </Typography>
                                <Typography variant="body2">
                                  {order.address}
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>
                        </Grid>

                        <Divider sx={{ my: 2 }} />

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            Total Amount
                          </Typography>
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            color="primary.main"
                          >
                            ${order.total_price || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  ))}
                </Stack>
              ) : (
                <Box
                  sx={{
                    py: 8,
                    textAlign: "center",
                    color: "text.secondary",
                  }}
                >
                  <ShoppingCartIcon
                    sx={{ fontSize: 64, mb: 2, opacity: 0.5 }}
                  />
                  <Typography variant="h6" mb={1}>
                    No orders found
                  </Typography>
                  <Typography variant="body2">
                    You haven't placed any orders yet
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Stack>
      </Container>

      {/* Update Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 4 },
        }}
      >
        <DialogTitle
          sx={{
            pb: 2,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            color: "white",
          }}
        >
          Update Profile
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 3 }}>
            <TextField
              label="First Name"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="Last Name"
              name="lastname"
              value={formData.lastname}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
            />
            <TextField
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              margin="normal"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleClose}
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ borderRadius: 2 }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserPage;
