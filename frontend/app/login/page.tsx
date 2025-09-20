"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Container,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../lip/store";
import { setLogin, setRole, setUserId, setUserName } from "../lip/userSlice";
const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });

      console.log("login success", response.data);
      dispatch(setLogin(response.data.token));
      dispatch(setUserId(response.data.user.id));
      dispatch(setUserName(response.data.user.firstName));
      dispatch(setRole(response.data.user.role_id));

      router.push("/");
    } catch (error: any) {
      console.error("login error", error.message);
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 2,
        }}
      >
        <Card
          sx={{
            maxWidth: 400,
            width: "100%",
            boxShadow: 4,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography
              variant="h5"
              component="h1"
              align="center"
              gutterBottom
              sx={{ color: "#d63384" }}
            >
              Welcome Back 👶
            </Typography>

            <Box component="form" noValidate autoComplete="off">
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#f48fb1" },
                    "&:hover fieldset": { borderColor: "#f06292" },
                    "&.Mui-focused fieldset": { borderColor: "#ec407a" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#f48fb1",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#ec407a",
                  },
                }}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#f48fb1" },
                    "&:hover fieldset": { borderColor: "#f06292" },
                    "&.Mui-focused fieldset": { borderColor: "#ec407a" },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#f48fb1",
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#ec407a",
                  },
                }}
              />

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleLogin}
                sx={{
                  mt: 3,
                  backgroundColor: "#ec407a",
                  "&:hover": {
                    backgroundColor: "#c02677",
                  },
                }}
              >
                Sign In
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

export default Login;
