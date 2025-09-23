"use client";

import axios from "axios";
import { useParams } from "next/navigation";
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
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

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



const user = () => {
  const [user, setUser] = useState<UserType[]>([]);
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

  useEffect(() => {
    getInformation();
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: 5,
      }}
    >
      <Stack spacing={3} sx={{ width: 600 }}>
        {user.length === 0 ? (
          <Typography variant="h6" align="center">
            No user data available.
          </Typography>
        ) : (
          user.map((ele) => (
            <Card key={ele.id} sx={{borderRadius: 3, boxShadow: 5 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom color="black">
                  Personal info
                </Typography>
                <Typography variant="body2" color="gray" mb={3}>
                  Customize how your profile information will appear to the networks.
                </Typography>

                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar
                      src="/avatar.png"
                      alt="Profile"
                      sx={{ width: 64, height: 64 }}
                    />
                    <Stack direction="row" spacing={2} width="100%">
                      <TextField
                        label="First name"
                        name="firstname"
                        value={ele.firstname}
                        fullWidth
                        InputProps={{ readOnly: true }}
                        InputLabelProps={{ style: { color: "gray" } }}
                        sx={{ input: { color: "black" } }}
                      />
                      <TextField
                        label="Last name"
                        name="lastname"
                        value={ele.lastname}
                        fullWidth
                        InputProps={{ readOnly: true }}
                        InputLabelProps={{ style: { color: "gray" } }}
                        sx={{ input: { color: "black" } }}
                      />
                    </Stack>
                  </Stack>

                  <TextField
                    label="Email"
                    name="email"
                    value={ele.email}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ style: { color: "gray" } }}
                    sx={{ input: { color: "black" } }}
                  />

                  <TextField
                    label="Country"
                    name="country"
                    value={ele.country}
                    fullWidth
                    InputProps={{ readOnly: true }}
                    InputLabelProps={{ style: { color: "gray" } }}
                    sx={{ input: { color: "black" } }}
                  />

                  <Stack direction="row" justifyContent="flex-end">
                    <Button
                      variant="contained"
                      
                      onClick={() => handleOpenUpdate(ele)}
                      sx={{
                        backgroundColor: "#f06292",
                        "&:hover": {
                          backgroundColor: "#d81b60",
                        },
                      }}
                    >
                      Update
                    </Button>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>

      {/* Dialog for Update */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleUpdate} variant="contained" sx={{
                        backgroundColor: "#f06292",
                        "&:hover": {
                          backgroundColor: "#d81b60",
                        },
                      }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default user;