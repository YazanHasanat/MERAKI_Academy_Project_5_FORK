import { Avatar, Box, Stack, Typography, Divider } from "@mui/material";

type UserType = {
  firstname: string;
  lastname: string;
  email: string;
  country: string;
  avatar?: string;
};

export default function UserInfo({ user }: { user: UserType | null }) {
  const userAvatar = (user?.avatar || (typeof window !== "undefined" && localStorage.getItem("avatar"))) || "/avatar.png";
  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: "bold", mb: 3, color: "#1976d2", textAlign: "center" }}>
        Driver Information
      </Typography>
      <Stack spacing={3} alignItems="center">
        <Avatar src={userAvatar} alt="Driver Profile" sx={{ width: 120, height: 120, border: "3px solid #1976d2" }} />
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center" width="100%">
          <Box sx={{ flex: 1, p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">First Name</Typography>
            <Typography variant="body1" fontWeight="bold">{user?.firstname || "-"}</Typography>
          </Box>
          <Box sx={{ flex: 1, p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">Last Name</Typography>
            <Typography variant="body1" fontWeight="bold">{user?.lastname || "-"}</Typography>
          </Box>
        </Stack>
        <Divider sx={{ width: "100%" }} />
        <Box sx={{ width: "100%", p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Email</Typography>
          <Typography variant="body1">{user?.email || "-"}</Typography>
        </Box>
        <Box sx={{ width: "100%", p: 2, bgcolor: "#f9f9f9", borderRadius: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Country</Typography>
          <Typography variant="body1">{user?.country || "-"}</Typography>
        </Box>
      </Stack>
    </Box>
  );
}
