"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

type Category = { id: number; name: string };
type Product = {
  id: number;
  title: string;
  categoryId?: number;
  price: number;
};
type OrderProduct = {
  product_id: number;
  title: string;
  quantity: number;
  price: number;
  categoryId?: number;
};
type Order = {
  id: number;
  products: OrderProduct[];
  total_price: number;
  created_at: string;
  status: string;
  user_id: number;
};
type User = { id: number; firstname: string; email: string; createdAt: string };

export default function DashboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, prodRes, orderRes, userRes] = await Promise.all([
          axios.get("http://localhost:5000/categories"),
          axios.get("http://localhost:5000/products"),
          axios.get("http://localhost:5000/orders/info"),
          axios.get("http://localhost:5000/users/get"),
        ]);

        setCategories(catRes.data);
        setProducts(prodRes.data.products);

        const enrichedOrders: Order[] = orderRes.data.map((order: any) => {
          const detailedProducts: OrderProduct[] = order.products.map((p: any) => {
            const prodInfo = prodRes.data.products.find(
              (prod: Product) => prod.id === p.product_id
            );
            return {
              product_id: p.product_id,
              title: p.title,
              quantity: p.quantity,
              price: parseFloat(p.price),
              categoryId: prodInfo?.categoryId,
            };
          });

          const total_price = detailedProducts.reduce(
            (sum, p) => sum + p.price * p.quantity,
            0
          );

          return {
            id: order.order_id,
            user_id: order.user_id,
            status: order.status,
            pay_method: order.pay_method,
            created_at: order.created_at,
            products: detailedProducts,
            total_price,
          };
        });

        setOrders(enrichedOrders);
        setUsers(userRes.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, []);

  const totalCategories = categories.length;
  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + o.total_price, 0);

  const productSalesCount: Record<string, number> = {};
  orders.forEach((o) => {
    o.products.forEach((p) => {
      productSalesCount[p.title] = (productSalesCount[p.title] || 0) + p.quantity;
    });
  });
  const bestProduct = Object.entries(productSalesCount).sort((a, b) => b[1] - a[1])[0];

  

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      {/* ---------- Cards ---------- */}
      <Grid container spacing={2}>
        {[
          { label: "Categories", value: totalCategories },
          { label: "Products", value: totalProducts },
          { label: "Users", value: totalUsers },
          { label: "Orders", value: totalOrders },
          { label: "Total Sales", value: `$${totalSales.toFixed(2)}` },
        ].map((card, idx) => (
          <Grid key={idx}>
            <Card>
              <CardContent>
                <Typography variant="h6">{card.label}</Typography>
                <Typography variant="h4">{card.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ---------- Best Product ---------- */}
      {bestProduct && (
        <Card style={{ marginTop: 20 }}>
          <CardContent>
            <Typography variant="h6">Best Selling Product</Typography>
            <Typography>{bestProduct[0]} - {bestProduct[1]} sold</Typography>
          </CardContent>
        </Card>
      )}
      {/* ---------- Last 5 Orders Table ---------- */}
      <Card style={{ marginTop: 20 }}>
        <CardContent>
          <Typography variant="h6">Last 5 Orders</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order ID</TableCell>
                <TableCell>User ID</TableCell>
                <TableCell>Products</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 5)
                .map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.user_id}</TableCell>
                    <TableCell>{order.products.map((p) => `${p.title} (${p.quantity})`).join(", ")}</TableCell>
                    <TableCell>${order.total_price.toFixed(2)}</TableCell>
                    <TableCell>{order.status}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* ---------- Last 5 Users Table ---------- */}
      <Card style={{ marginTop: 20 }}>
        <CardContent>
          <Typography variant="h6">Last 5 Users</Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>{u.id}</TableCell>
                    <TableCell>{u.firstname}</TableCell>
                    <TableCell>{u.email}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
