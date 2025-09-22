"use client";

import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "start",
        padding: 3,
      }}
    >
      <Stack spacing={2} sx={{ width: 400 }}>
        {user.length === 0 && (
          <Typography variant="h6" align="center">
            No user data available.
          </Typography>
        )}

        {user.map((ele, index) => (
          <Card key={index} sx={{ boxShadow: 3, borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom color="primary">
                {ele.firstname} {ele.lastname}
              </Typography>

              <Typography variant="body1">
                <strong>Country:</strong> {ele.country}
              </Typography>

              <Typography variant="body1">
                <strong>Email:</strong> {ele.email}
              </Typography>

              <Typography variant="body1" sx={{ mb: 2 }}>
                <strong>Age:</strong> {ele.age}
              </Typography>

              <Button
                variant="contained"
                color="primary"
                onClick={() => handleOpenUpdate(ele)}
              >
                Update
              </Button>
            </CardContent>
          </Card>
        ))}
      </Stack>

      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update User</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="First Name"
            name="firstname"
            fullWidth
            value={formData.firstname}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Last Name"
            name="lastname"
            fullWidth
            value={formData.lastname}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Country"
            name="country"
            fullWidth
            value={formData.country}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            label="Email"
            name="email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default user;