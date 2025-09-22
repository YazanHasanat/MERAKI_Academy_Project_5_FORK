"use client";

import { Box, Container, Typography, Link, IconButton } from "@mui/material";


export default function Footer() {
  return (
    <Box sx={{ bgcolor: "#F8BBD0", color: "black", mt: 0, py: 4 }}>
      <Container>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Bebek Baby
            </Typography>
            <Typography variant="body2">
              Your trusted store for baby products.
            </Typography>
          </Box>

         
          <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap", mt: { xs: 2, md: 0 } }}>
            <Link href="/category/1" underline="hover" color="inherit">Clothing</Link>
            <Link href="/category/2" underline="hover" color="inherit">Toys & Games</Link>
            <Link href="/category/3" underline="hover" color="inherit">Nutrition</Link>
            <Link href="/category/4" underline="hover" color="inherit">Furniture</Link>
            <Link href="/category/5" underline="hover" color="inherit">Baby Gear</Link>
          </Box>
        </Box>

        

      </Container>
    </Box>
  );
}
