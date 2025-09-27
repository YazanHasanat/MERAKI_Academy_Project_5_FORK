"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  useTheme,
} from "@mui/material";
import { useThemeToggle } from "../components/Theme"; // اذا بدك تستخدم التوجل من زر خارجي

const Login = () => {
  const router = useRouter();
  const theme = useTheme(); // 👈 ناخذ الثيم الحالي
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("role_id", response.data.user.role_id);
      localStorage.setItem("firstName", response.data.user.firstName);

      setErrorMsg("");
      router.push("/");
      window.dispatchEvent(new Event("storageUpdate"));
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.error || "Login failed, please try again."
      );
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const token = credentialResponse.credential;
      if (!token) return;
      const decoded: { picture?: string; [key: string]: any } = jwtDecode(
        token as string
      );

      const response = await axios.post(
        "http://localhost:5000/users/google-login",
        { token },
        { withCredentials: true }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      localStorage.setItem("role_id", response.data.user.role_id);
      localStorage.setItem("firstName", response.data.user.firstName);
      localStorage.setItem("avatar", decoded.picture || "");

      setErrorMsg("");
      router.push("/");
      window.dispatchEvent(new Event("storageUpdate"));
    } catch (error: any) {
      setErrorMsg(
        error.response?.data?.error || "Google login failed, please try again."
      );
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
        bgcolor: theme.palette.mode === "light" ? "#f7f7fa" : "#121212",
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
            bgcolor: theme.palette.background.paper, // 👈 paper يتغير حسب الثيم
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
                sx={{
                  color:
                    theme.palette.mode === "light"
                      ? "#d63384"
                      : "#ce93d8", // 👈 purple للدارك
                }}
              >
                👶 Welcome Back
              </Typography>
            </motion.div>

            <Box component="form" noValidate autoComplete="off">
              {[{ label: "Email", value: email, setter: setEmail, type: "email" },
                { label: "Password", value: password, setter: setPassword, type: "password" }].map((field, i) => (
                <motion.div
                  key={field.label}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.2, duration: 0.6 }}
                >
                  <TextField
                    label={field.label}
                    type={field.type}
                    fullWidth
                    margin="normal"
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor:
                            theme.palette.mode === "light"
                              ? "rgba(0,0,0,0.23)"
                              : "#777",
                        },
                        "&:hover fieldset": {
                          borderColor:
                            theme.palette.mode === "light" ? "#f06292" : "#ce93d8",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor:
                            theme.palette.mode === "light" ? "#ec407a" : "#ba68c8",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color:
                          theme.palette.mode === "light"
                            ? "rgba(0,0,0,0.6)"
                            : "#ccc",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: theme.palette.mode === "light" ? "#ec407a" : "#ba68c8",
                      },
                    }}
                  />
                </motion.div>
              ))}

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
                    backgroundColor:
                      theme.palette.mode === "light" ? "#ec407a" : "#9c27b0", // 👈 داكن للدارك
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "light" ? "#c02677" : "#7b1fa2",
                    },
                  }}
                >
                  Sign In
                </Button>
              </motion.div>

              <Typography
                align="center"
                sx={{
                  my: 2,
                  fontWeight: "bold",
                  color: theme.palette.mode === "light" ? "gray" : "#ccc",
                }}
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
                <Alert
                  severity="error"
                  sx={{
                    mt: 2,
                    bgcolor: theme.palette.mode === "light" ? "#ffcdd2" : "#880e4f",
                    color: theme.palette.mode === "light" ? "#b71c1c" : "#ffb6d2",
                  }}
                >
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
                sx={{
                  mt: 2,
                  color: theme.palette.mode === "light" ? "gray" : "#ccc",
                }}
              >
                Don’t have an account?{" "}
                <Link
                  href="/register"
                  style={{
                    color: theme.palette.mode === "light" ? "#ec407a" : "#ba68c8",
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
