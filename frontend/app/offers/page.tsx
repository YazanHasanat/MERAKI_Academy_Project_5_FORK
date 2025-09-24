"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "next/link";
import Button from "@mui/material/Button";

const OffersPage = () => {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/products/offers/all");
      setOffers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  if (loading)
    return (
      <Typography variant="h6" align="center">
        Loading offers...
      </Typography>
    );

  return (
    <Box sx={{ p: 4, minHeight: "100vh", bgcolor: "#f7f7fa" }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ fontWeight: "bold", mb: 4 }}
      >
        Special Offers
      </Typography>

      <Grid container spacing={4} justifyContent="center" alignItems="stretch">
        {offers.map((offer) => (
          <Grid key={offer.id} display="flex">
            <Card
              sx={{
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                position: "relative",
                boxShadow: 6,
                borderRadius: 3,
                "&:hover": { transform: "scale(1.05)", boxShadow: 10 },
                transition: "0.3s",
              }}
            >
              {/* Offer badge */}
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  bgcolor: "#EC407A",
                  color: "#fff",
                  px: 1.5,
                  py: 0.5,
                  fontWeight: "bold",
                  borderRadius: 1,
                  fontSize: 12,
                  zIndex: 1,
                }}
              >
                Offer
              </Box>

              <CardMedia
                component="img"
                image={`/assets/${offer.image_urls?.[0] || "home.png"}`}
                alt={offer.title}
                sx={{ height: 200, objectFit: "cover" }}
              />

              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    {offer.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1, textAlign: "center" }}
                  >
                    {offer.description?.slice(0, 60)}...
                  </Typography>

                  <Box sx={{ textAlign: "center", mb: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textDecoration: "line-through" }}
                    >
                      {offer.old_price} JD
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: "#EC407A", fontWeight: "bold" }}
                    >
                      {offer.new_price} JD
                    </Typography>
                  </Box>
                </Box>

                <Link
                  href={`/product/${offer.id}`}
                  style={{ textDecoration: "none", marginTop: "auto" }}
                >
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      textTransform: "none",
                      borderRadius: 2,
                      bgcolor: "#EC407A",
                      "&:hover": { bgcolor: "#d53972" },
                    }}
                  >
                    View Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default OffersPage;
