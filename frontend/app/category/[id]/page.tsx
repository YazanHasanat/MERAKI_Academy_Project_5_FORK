"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
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
}
export default CategoryPage;