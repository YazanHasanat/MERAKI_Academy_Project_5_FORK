import { Box, Button, Typography } from "@mui/material";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", background: "#f5f5f5" }}>
      <Box
        sx={{
          width: 220,
          background: "#fff",
          boxShadow: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          py: 4,
          px: 2,
        }}
      >
        <Typography variant="h6" mb={2} textAlign="center" color="primary">
          Admin Dashboard
        </Typography>
        <Button sx={{ mb: 1 }} variant="outlined" component={Link} href="/admin/category">Category info</Button>
        <Button sx={{ mb: 1 }} variant="outlined" component={Link} href="/admin/products">Products info</Button>
        <Button sx={{ mb: 1 }} variant="outlined" component={Link} href="/admin/users">User info</Button>
        <Button sx={{ mb: 1 }} variant="outlined" component={Link} href="/admin/dashboard">Dashboard</Button>
      </Box>
      <Box sx={{ flex: 1, p: 4 }}>
        {children}
      </Box>
    </Box>
  );
}
