"use client";

import { Box, Container, Typography, Grid, Button, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import StarIcon from "@mui/icons-material/Star";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import SecurityIcon from "@mui/icons-material/Security";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ToysIcon from "@mui/icons-material/Toys";
import FavoriteIcon from "@mui/icons-material/Favorite";

const FeatureCard = ({ 
  title, 
  desc, 
  img, 
  icon,
  delay 
}: { 
  title: string; 
  desc: string; 
  img: string;
  icon: React.ReactNode;
  delay: number;
}) => (
  <motion.div
    whileHover={{ y: -10 }}
    whileInView={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: 50 }}
    transition={{ duration: 0.6, delay }}
  >
    <Box
      sx={{
        bgcolor: "white",
        p: 4,
        borderRadius: 4,
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 20px 40px rgba(240, 98, 146, 0.2)",
          transform: "translateY(-5px)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "5px",
          background: "linear-gradient(90deg, #F06292, #BA68C8, #64B5F6)",
        }
      }}
    >
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          bgcolor: "linear-gradient(135deg, #F06292, #BA68C8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
          boxShadow: "0 5px 15px rgba(240, 98, 146, 0.3)",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={img}
          alt={title}
          sx={{
            width: "80%",
            height: "80%",
            objectFit: "contain",
          }}
        />
      </Box>
      <Typography variant="h5" sx={{ mb: 2, color: "#F06292", fontWeight: "bold" }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6 }}>
        {desc}
      </Typography>
    </Box>
  </motion.div>
);

export default function AboutPage() {
  return (
    <Box sx={{ bgcolor: "#FFF5F8", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      {/* Decorative Background Elements */}
      <Box
        component={motion.div}
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        sx={{
          position: "absolute",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(240, 98, 146, 0.1) 0%, rgba(240, 98, 146, 0) 70%)",
          top: "10%",
          left: "5%",
          zIndex: 0,
        }}
      />
      <Box
        component={motion.div}
        animate={{
          x: [0, -100, 0],
          y: [0, 100, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        sx={{
          position: "absolute",
          width: 250,
          height: 250,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(186, 104, 200, 0.1) 0%, rgba(186, 104, 200, 0) 70%)",
          bottom: "10%",
          right: "5%",
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
        {/* Header Section */}
        <Box sx={{ py: 8, textAlign: "center" }}>
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  bgcolor: "linear-gradient(135deg, #F06292, #BA68C8)",
                  boxShadow: "0 10px 25px rgba(240, 98, 146, 0.3)",
                }}
              >
                <ChildCareIcon sx={{ fontSize: 40 }} />
              </Avatar>
            </Box>
            <Typography
              variant="h2"
              align="center"
              sx={{ 
                fontWeight: "bold", 
                mb: 3, 
                background: "linear-gradient(90deg, #F06292, #BA68C8)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome to KiddyJoy!
            </Typography>
            <Typography
              variant="h6"
              align="center"
              sx={{ 
                mb: 6, 
                color: "#555", 
                lineHeight: 1.7, 
                maxWidth: 800, 
                mx: "auto",
                fontSize: "1.1rem"
              }}
            >
              At KiddyJoy, we create magical experiences for children. Our products are safe, fun, and
              designed to spark imagination, learning, and happiness.
            </Typography>
          </motion.div>
        </Box>

        {/* Features Section */}
        <Box sx={{ mb: 10 }}>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h4"
              align="center"
              sx={{ 
                mb: 6, 
                color: "#333", 
                fontWeight: "bold",
                position: "relative",
                display: "inline-block",
                width: "100%",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  width: "80px",
                  height: "4px",
                  bottom: "-10px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(90deg, #F06292, #BA68C8)",
                  borderRadius: "2px",
                }
              }}
            >
              Why Parents Choose Us
            </Typography>
          </motion.div>

          <Grid container spacing={4} justifyContent="center">
            <Grid >
              <FeatureCard
                img="/assets/safety.png"
                title="Safe & Reliable"
                desc="Every product is carefully selected to ensure your child's safety and comfort. We exceed safety standards."
                icon={<SecurityIcon sx={{ fontSize: 40, color: "white" }} />}
                delay={0.1}
              />
            </Grid>
            <Grid >
              <FeatureCard
                img="/assets/fun.png"
                title="Fun & Playful"
                desc="Our toys and games make learning enjoyable and inspire creativity in every child."
                icon={<ToysIcon sx={{ fontSize: 40, color: "white" }} />}
                delay={0.2}
              />
            </Grid>
            <Grid >
              <FeatureCard
                img="/assets/happy.png"
                title="Happy Customers"
                desc="We love seeing parents smile and children happy with our products. Your joy is our success!"
                icon={<EmojiEmotionsIcon sx={{ fontSize: 40, color: "white" }} />}
                delay={0.3}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Story Section */}
        <Box sx={{ mb: 10 }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box
              sx={{
                bgcolor: "white",
                p: 6,
                borderRadius: 4,
                boxShadow: "0 15px 35px rgba(0,0,0,0.08)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "200px",
                  height: "200px",
                  background: "radial-gradient(circle, rgba(240, 98, 146, 0.1) 0%, rgba(240, 98, 146, 0) 70%)",
                  borderRadius: "50%",
                  transform: "translate(50%, -50%)",
                }}
              />
              <Typography variant="h4" sx={{ mb: 3, color: "#F06292", fontWeight: "bold" }}>
                Our Story
              </Typography>
              <Typography variant="body1" sx={{ maxWidth: 700, color: "#555", lineHeight: 1.8, fontSize: "1.05rem" }}>
                KiddyJoy started with a simple mission: to bring joy and imagination to every child. We
                believe childhood is a magical time, and our goal is to create products that make it
                even more special. From toys and games to clothing and baby gear, we combine safety,
                fun, and learning in every item.
              </Typography>
              <Box sx={{ mt: 4, display: "flex", gap: 2, flexWrap: "wrap" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <StarIcon key={star} sx={{ color: "#FFD700", fontSize: 30 }} />
                ))}
                <Typography variant="body1" sx={{ ml: 2, color: "#666", alignSelf: "center" }}>
                  Trusted by 10,000+ Happy Parents
                </Typography>
              </Box>
            </Box>
          </motion.div>
        </Box>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              px: 4,
              borderRadius: 4,
              background: "linear-gradient(135deg, #F06292, #BA68C8)",
              boxShadow: "0 20px 40px rgba(240, 98, 146, 0.3)",
            }}
          >
            <Typography variant="h4" sx={{ mb: 2, color: "white", fontWeight: "bold" }}>
              Join the KiddyJoy Family!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: "rgba(255,255,255,0.9)" }}>
              Discover amazing products that will bring smiles to your little ones
            </Typography>
            <Button
              variant="contained"
              size="large"
              endIcon={<FavoriteIcon />}
              sx={{
                bgcolor: "white",
                color: "#F06292",
                fontWeight: "bold",
                px: 4,
                py: 1.5,
                borderRadius: "30px",
                fontSize: "1.1rem",
                "&:hover": {
                  bgcolor: "#f5f5f5",
                  transform: "scale(1.05)",
                },
              }}
            >
              Shop Now
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}