"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Card,
  Typography,
  useTheme,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

const AuthorizePage = () => {
  const router = useRouter();
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: "80vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
        bgcolor: theme.palette.mode === "light"
          ? "linear-gradient(135deg, #fbe9f7, #f3e5f5)"
          : "linear-gradient(135deg, #1a001f, #330033)",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          width: "90%",
          maxWidth: 700, 
          minHeight: 300,
        }}
      >
        <Card
          sx={{
            display: "flex",
            flexDirection: "row", 
            alignItems: "center",
            justifyContent: "space-around",
            p: 4,
            borderRadius: 4,
            boxShadow: 6,
            bgcolor: theme.palette.background.paper,
          }}
        >
          <ErrorOutlineIcon
            sx={{
              fontSize: 150,
              color: theme.palette.mode === "light" ? "#d63384" : "#ff80ab",
            }}
          />

          <Box sx={{ maxWidth: 350, textAlign: "left" }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                mb: 2,
                color: theme.palette.mode === "light" ? "#d63384" : "#ff80ab",
              }}
            >
              Access Denied
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 4,
                color: theme.palette.mode === "light" ? "#555" : "#ccc",
                lineHeight: 1.6,
              }}
            >
              Sorry, you don’t have permission to access this page.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => router.push("/")}
              sx={{
                mt: 1,
                backgroundColor: theme.palette.mode === "light" ? "#ec407a" : "#9c27b0",
                color: "#fff",
                "&:hover": {
                  backgroundColor: theme.palette.mode === "light" ? "#d81b60" : "#7b1fa2",
                },
              }}
            >
               Back to Home
            </Button>
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

export default AuthorizePage;
