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
} from "@mui/material";

 function Register() {
  const router = useRouter();

  
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [age, setAge] = useState<number | string>("");


  const handleRegister = async () => {
    try {
      const response = await axios.post("http://localhost:5000/users/register", {
        firstName,
        lastName,
        country,
        email,
        password,
        age: typeof age === "string" ? parseInt(age) || 0 : age,
      });

      console.log("register success", response.data);
      router.push("/login");
    } catch (error: any) {
      console.error("register error", error.message);
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
          maxWidth: 500,
          width: "100%",
          boxShadow: 4,
          borderRadius: 3,
          backgroundColor: "#fff",
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            component="h1"
            align="center"
            gutterBottom
            sx={{ color: "#d63384", fontWeight: 600 }}
          >
             Create Your Account 👶
          </Typography>

          <Box component="form" noValidate autoComplete="off">
            <TextField
              label="First Name"
              fullWidth
              margin="normal"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              label="Last Name"
              fullWidth
              margin="normal"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              label="Country"
              fullWidth
              margin="normal"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="Age"
              type="number"
              fullWidth
              margin="normal"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

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
          </Box>
        </CardContent>
      </Card>
    </Box>
    </>
  );
}

export default Register;
