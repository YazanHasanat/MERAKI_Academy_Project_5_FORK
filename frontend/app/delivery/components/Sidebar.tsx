"use client";
import { Box, Button, Typography, Stack } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "User Info", key: "userinfo" },
  { label: "Pending Orders", key: "pending" },
  { label: "My Orders", key: "myorders" },
  { label: "Completed Orders", key: "completed" },
];

export default function Sidebar({ selected, onSelect }: { selected: string; onSelect: (key: string) => void }) {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("firstName");
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("role_id");
    localStorage.removeItem("avatar");
    setTimeout(() => {
      window.location.reload();
    }, 200);
    router.push("/");
  };

  return (
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
        position: "sticky",
        top: 0,
        height: "100vh",
      }}
    >
      <Typography variant="h6" mb={2} textAlign="center" color="primary">
        Delivery Menu
      </Typography>
      <Stack spacing={1}>
        {navItems.map((item) => (
          <Button
            key={item.key}
            variant={selected === item.key ? "contained" : "outlined"}
            onClick={() => onSelect(item.key)}
            sx={{ mb: 1 }}
            fullWidth
          >
            {item.label}
          </Button>
        ))}
      </Stack>
      <Box sx={{ flex: 1 }} />
      <Button sx={{ mt: "auto" }} variant="outlined" color="error" onClick={handleLogout}>
        Logout
      </Button>
    </Box>
  );
}
