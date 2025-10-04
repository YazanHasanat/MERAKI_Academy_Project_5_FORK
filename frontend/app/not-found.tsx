"use client";

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#fdfdfd",
        px: 2,
        textAlign: "center",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      }}
    >
      <Box
        component="img"
        src="https://www.shutterstock.com/image-photo/little-baby-carrier-mother-binoculars-600nw-1084907825.jpg"
        alt="Not Found Illustration"
        sx={{
          maxWidth: 420,
          width: "100%",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          mb: 4,
        }}
      />
      <Typography
        variant="h4"
        sx={{
          mb: 2,
          fontWeight: 700,
          color: "#333",
          textShadow: "0px 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        Oops! You’re searching for something that doesn't exist
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        sx={{
          mb: 4,
          maxWidth: 500,
          fontSize: "1.1rem",
          lineHeight: 1.6,
          textShadow: "0px 1px 3px rgba(0,0,0,0.05)",
        }}
      >
        The page you’re trying to access may have been moved or deleted!
      </Typography>
      <Link href="/" passHref>
        <Button
          variant="contained"
          size="large"
          sx={{
            textTransform: "none",
            borderRadius: "30px",
            px: 4,
            py: 1.5,
            fontWeight: "bold",
            fontSize: "1rem",
            bgcolor: "#EC407A",
            "&:hover": {
              bgcolor: "#d81b60",
            },
            boxShadow: "0 4px 14px rgba(236, 64, 122, 0.3)",
          }}
        >
          Go Back Home
        </Button>
      </Link>
    </Box>
  );
};

export default NotFoundPage;
