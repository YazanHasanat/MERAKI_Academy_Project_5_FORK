"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errorMsg, setErrorMsg] = useState<string>(""); // 👈 error message state

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });

      console.log("login success", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("role_id", response.data.user.role_id);
      localStorage.setItem("firstName", response.data.user.firstName);

      // clear error if login is successful
      setErrorMsg("");

      router.push("/");

      window.dispatchEvent(new Event("storageUpdate"));

    } catch (error: any) {
      console.error("login error", error);

      // 👇 show error message coming from backend
      if (error.response?.data?.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("Login failed, please try again.");
      }
    }
  };
  const handleGoogleSuccess = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const token = credentialResponse.credential;
      if (!token) return;

      const response = await axios.post(
        "http://localhost:5000/users/google-login",
        { token },
        { withCredentials: true }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("role_id", response.data.user.role_id);
      localStorage.setItem("firstName", response.data.user.firstName);

      setErrorMsg("");
      router.push("/");
      window.dispatchEvent(new Event("storageUpdate"));
    } catch (error: any) {
      console.error("Google login error", error);
      if (error.response?.data?.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("Google login failed, please try again.");
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ width: "100%", maxWidth: 400 }}
      >
        <Card
          sx={{
            width: "100%",
            boxShadow: 4,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Typography
                variant="h5"
                component="h1"
                align="center"
                gutterBottom
                sx={{ color: "#d63384" }}
              >
                👶 Welcome Back
              </Typography>
            </motion.div>

            <Box component="form" noValidate autoComplete="off">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(0,0,0,0.23)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#f06292",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ec407a",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(0,0,0,0.6)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#ec407a",
                    },
                  }}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <TextField
                  label="Password"
                  type="password"
                  fullWidth
                  margin="normal"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "rgba(0,0,0,0.23)",
                      },
                      "&:hover fieldset": {
                        borderColor: "#f06292",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "#ec407a",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: "rgba(0,0,0,0.6)",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#ec407a",
                    },
                  }}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
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
              </motion.div>
              <Typography
                align="center"
                sx={{ my: 2, fontWeight: "bold", color: "gray" }}
              >
                OR
              </Typography>
              <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setErrorMsg("Google login failed")}
                  useOneTap
                  theme="outline" 
                  size="large" 
                  shape="rectangular" 
                  text="continue_with" 
                  width="300" 
                />
              </Box>

              {errorMsg && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {errorMsg}
                </Alert>
              )}
            </Box>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <Typography
                variant="body2"
                align="center"
                sx={{ mt: 2, color: "gray" }}
              >
                Don’t have an account?{" "}
                <Link
                  href="/register"
                  style={{
                    color: "#ec407a",
                    fontWeight: "bold",
                    textDecoration: "none",
                  }}
                >
                  Register Now
                </Link>
              </Typography>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default Login;
