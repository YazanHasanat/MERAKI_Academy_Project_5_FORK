"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
} from "@mui/material";

function Register() {
  const router = useRouter();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [age, setAge] = useState<number | string>("");

  const [successMsg, setSuccessMsg] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/users/register",
        {
          firstName,
          lastName,
          country,
          email,
          password,
          age: typeof age === "string" ? parseInt(age) || 0 : age,
          role_id: 2,
        }
      );

      setErrorMsg("");
      setSuccessMsg(response.data.message);

      setTimeout(() => {
        router.push("/login");
      }, 5000);
    } catch (error: any) {
      setSuccessMsg("");
      if (error.response?.data?.error) {
        setErrorMsg(error.response.data.error);
      } else {
        setErrorMsg("Something went wrong");
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
        style={{ width: "100%", maxWidth: 500 }}
      >
        <Card
          sx={{
            width: "100%",
            boxShadow: 4,
            borderRadius: 3,
            backgroundColor: "#fff",
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
                sx={{ color: "#d63384", fontWeight: 600 }}
              >
                Create Your Account 👶
              </Typography>
            </motion.div>

            <Box component="form" noValidate autoComplete="off">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <TextField
                  label="First Name"
                  fullWidth
                  margin="normal"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <TextField
                  label="Last Name"
                  fullWidth
                  margin="normal"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <TextField
                  label="Country"
                  fullWidth
                  margin="normal"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
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
                transition={{ delay: 0.8, duration: 0.6 }}
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
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
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
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                <TextField
                  label="Age"
                  type="number"
                  fullWidth
                  margin="normal"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
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
                  onClick={handleRegister}
                  sx={{
                    mt: 3,
                    backgroundColor: "#ec407a",
                    "&:hover": {
                      backgroundColor: "#d81b60",
                    },
                  }}
                >
                  Sign Up
                </Button>
              </motion.div>

              {/* Backend messages at the bottom */}
              {successMsg && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  {successMsg}
                </Alert>
              )}
              {errorMsg && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {errorMsg}
                </Alert>
              )}

              {/* 👇 Already have account */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <Typography
                  variant="body2"
                  align="center"
                  sx={{ mt: 2, color: "gray" }}
                >
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    style={{
                      color: "#ec407a",
                      fontWeight: "bold",
                      textDecoration: "none",
                    }}
                  >
                    Login
                  </Link>
                </Typography>
              </motion.div>
            </Box>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
}

export default Register;
