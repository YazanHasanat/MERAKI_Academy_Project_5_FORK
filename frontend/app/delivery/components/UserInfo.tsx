import { Avatar, Box, Stack, Typography, Divider, Paper, Chip, useTheme } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";

type UserType = {
  firstname: string;
  lastname: string;
  email: string;
  country: string;
  avatar?: string;
};

export default function UserInfo({ user }: { user: UserType | null }) {
  const theme = useTheme();
  const userAvatar = (user?.avatar || (typeof window !== "undefined" && localStorage.getItem("avatar"))) || "/avatar.png";
  
  return (
    <Box sx={{ width: "100%", maxWidth: 500, mx: "auto" }}>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          borderRadius: "16px 16px 0 0",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          }
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "white", position: "relative", zIndex: 1 }}>
          Driver Information
        </Typography>
        <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.8)", mt: 1, position: "relative", zIndex: 1 }}>
          Professional Delivery Partner
        </Typography>
      </Box>

      {/* Main Content */}
      <Paper
        elevation={8}
        sx={{
          borderRadius: "0 0 16px 16px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}
      >
        <Box sx={{ p: 4, bgcolor: "#ffffff" }}>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            mb: 4,
            gap: 3
          }}>
            <Avatar
              src={userAvatar}
              alt="Driver Profile"
              sx={{
                width: 120,
                height: 120,
                border: "4px solid",
                borderColor: "primary.main",
                boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                transition: "transform 0.3s ease",
                "&:hover": {
                  transform: "scale(1.05)"
                }
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "text.primary", mb: 1 }}>
                {user?.firstname || "-"} {user?.lastname || "-"}
              </Typography>
              <Chip
                label="Active Driver"
                size="small"
                sx={{
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                  fontWeight: "medium"
                }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3, borderColor: "rgba(0,0,0,0.08)" }} />

          {/* Information Cards */}
          <Stack spacing={3}>
            {/* Name Details */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                p: 3,
                bgcolor: "grey.50",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "grey.100",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                }
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PersonIcon sx={{ fontSize: 24, color: "primary.main" }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Full Name
                </Typography>
                <Typography variant="body1" fontWeight="600" color="text.primary">
                  {user?.firstname || "-"} {user?.lastname || "-"}
                </Typography>
              </Box>
            </Box>

            {/* Email */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                p: 3,
                bgcolor: "grey.50",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "grey.100",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                }
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <EmailIcon sx={{ fontSize: 24, color: "primary.main" }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Email Address
                </Typography>
                <Typography variant="body1" fontWeight="600" color="text.primary">
                  {user?.email || "-"}
                </Typography>
              </Box>
            </Box>

            {/* Country */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                p: 3,
                bgcolor: "grey.50",
                borderRadius: 3,
                border: "1px solid",
                borderColor: "grey.200",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "grey.100",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
                }
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LocationOnIcon sx={{ fontSize: 24, color: "primary.main" }} />
              </Box>
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}>
                  Location
                </Typography>
                <Typography variant="body1" fontWeight="600" color="text.primary">
                  {user?.country || "-"}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}