// app/loading.tsx
"use client";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function Loading() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
      }}
    >
      <CircularProgress size={60} thickness={4} color="secondary" />
      <Typography variant="h6" sx={{ color: "#555" }}>
        Loading, please wait...
      </Typography>
    </Box>
  );
}
