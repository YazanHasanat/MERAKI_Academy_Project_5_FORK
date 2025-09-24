"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Typography from "@mui/material/Typography";


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
        <Typography variant="h6" align="center">Loading...</Typography>
  );
};

export default OffersPage;
