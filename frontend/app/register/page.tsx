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

  // states
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [age, setAge] = useState<number | string>("");

  // submit handler
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
      <h2>Register</h2>
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="text"
        name="country"
        placeholder="Country"
        onChange={(e) => setCountry(e.target.value)}
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="number"
        name="age"
        placeholder="Age"
        onChange={(e) => setAge(e.target.value)}
      />

      <button onClick={handleRegister}>Sign Up</button>
    </>
  );
}

export default Register;
