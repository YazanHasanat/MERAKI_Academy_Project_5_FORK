"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const CategoryPage = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/products/category/${id}`)
      .then((res) => {
        console.log( res.data.products || res.data);
        setProducts(res.data.products || res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Products in Category {id}
      </Typography>
      <Grid container spacing={3}>
        {Array.isArray(products) && products.map((product: any) => (
          <Grid  key={product.id}>
            <Link href={`/product/${product.id}`} style={{ textDecoration: "none" }}>
              <Card>
                <CardMedia
                  component="img"
                  height="180"
                  image={`/assets/${product.image_urls?.[0] || "home.png"}`}
                  alt={product.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6">
                    {product.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.description?.slice(0, 60)}...
                  </Typography>
                  <Typography variant="subtitle1" color="primary">
                    {product.price ? `${product.price} JD` : ""}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default CategoryPage;