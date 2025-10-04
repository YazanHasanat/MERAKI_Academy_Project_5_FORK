"use client";

import { Box, Container, Typography, Grid } from "@mui/material";
import { motion } from "framer-motion";

const FeatureCard = ({ title, desc, img }: { title: string; desc: string; img: string }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileInView={{ opacity: 1, y: 0 }}
    initial={{ opacity: 0, y: 50 }}
    transition={{ duration: 0.6 }}
  >
    <Box
      sx={{
        bgcolor: "white",
        p: 4,
        borderRadius: 3,
        textAlign: "center",
        boxShadow: 3,
      }}
    >
      <Box component="img" src={img} alt={title} sx={{ width: 80, height: 80, mb: 2 }} />
      <Typography variant="h5" sx={{ mb: 1, color: "#F06292" }}>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {desc}
      </Typography>
    </Box>
  </motion.div>
);

export default function AboutPage() {
  return (
    <Box sx={{ py: 10, bgcolor: "#FFF0F5", minHeight: "100vh" }}>
      <Container maxWidth="lg">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{ fontWeight: "bold", mb: 4, color: "#F06292" }}
          >
            Welcome to KiddyJoy!
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{ mb: 6, color: "#333", lineHeight: 1.6 }}
          >
            At KiddyJoy, we create magical experiences for children. Our products are safe, fun, and
            designed to spark imagination, learning, and happiness.
          </Typography>
        </motion.div>

        {/* Features / Stories */}
        <Grid container spacing={4} justifyContent="center">
          <Grid >
            <FeatureCard
              img="/assets/safety.png"
              title="Safe & Reliable"
              desc="Every product is carefully selected to ensure your child's safety and comfort."
            />
          </Grid>
          <Grid >
            <FeatureCard
              img="/assets/fun.png"
              title="Fun & Playful"
              desc="Our toys and games make learning enjoyable and inspire creativity."
            />
          </Grid>
          <Grid >
            <FeatureCard
              img="/assets/happy.png"
              title="Happy Customers"
              desc="We love seeing parents smile and children happy with our products."
            />
          </Grid>
        </Grid>

        {/* Story Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <Box sx={{ mt: 10, textAlign: "center" }}>
            <Typography variant="h4" sx={{ mb: 3, color: "#F06292", fontWeight: "bold" }}>
              Our Story
            </Typography>
            <Typography variant="body1" sx={{ maxWidth: 700, mx: "auto", color: "#555" }}>
              KiddyJoy started with a simple mission: to bring joy and imagination to every child. We
              believe childhood is a magical time, and our goal is to create products that make it
              even more special. From toys and games to clothing and baby gear, we combine safety,
              fun, and learning in every item.
            </Typography>
          </Box>
        </motion.div>

        {/* Fun Illustration Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <Box sx={{ mt: 10, textAlign: "center" }}>
            <Box
              component="img"
              src="/assets/kids_playing.png"
              alt="Kids Playing"
              sx={{ maxWidth: "100%", height: "auto", borderRadius: 3 }}
            />
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
