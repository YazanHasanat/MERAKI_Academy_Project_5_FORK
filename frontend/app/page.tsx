"use client";

import React, { useEffect } from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import homapage from "./assets/home.png"
import axios from "axios";
export default function HeroSection() {
    const getallcategory=async()=>{
        const result=await axios.get("http://localhost:5000/categories")
        console.log(result.data);
        
    }
    useEffect(()=>{
        getallcategory()
    })
  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh", 
        backgroundImage: `url(${homapage.src})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.4)", 
        }}
      />

      <Box
        sx={{
          position: "relative",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <Typography variant="h2" gutterBottom>
          Welcome to Our Baby Shop
        </Typography>
        <Typography variant="h5" gutterBottom>
          Discover the best products for your baby
        </Typography>
        <Button variant="contained" size="large"
        style={{backgroundColor:"pink"}}>
          Shop Now
        </Button>
      </Box>
    </Box>
  );
}
