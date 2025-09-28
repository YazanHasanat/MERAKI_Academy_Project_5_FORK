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

// --------- Icons ----------
import CategoryIcon from "@mui/icons-material/Category";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

// --------- Types ----------
type Category = { id: number; name: string };
type Product = {
  id: number;
  title: string;
  categoryId?: number;
  price: number;
  image_urls: string[];
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
  image_urls?: string[];
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
          const detailedProducts: OrderProduct[] = order.products.map(
            (p: any) => {
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
            }
          );

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

  // ---------- Dashboard Stats ----------
  const totalCategories = categories.length;
  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + o.total_price, 0);

  const productSalesCount: Record<string, number> = {};
  orders.forEach((o) => {
    o.products.forEach((p) => {
      productSalesCount[p.title] =
        (productSalesCount[p.title] || 0) + p.quantity;
    });
  });
  const bestProduct = Object.entries(productSalesCount).sort(
    (a, b) => b[1] - a[1]
  )[0];

  // ---------- Cards Data ----------
  const cardsData = [
    {
      label: "Categories",
      value: totalCategories,
      color: "#f8bbd0",
      icon: <CategoryIcon fontSize="large" />,
    },
    {
      label: "Products",
      value: totalProducts,
      color: "#b3e5fc",
      icon: <ShoppingCartIcon fontSize="large" />,
    },
    {
      label: "Users",
      value: totalUsers,
      color: "#c8e6c9",
      icon: <PeopleIcon fontSize="large" />,
    },
    {
      label: "Orders",
      value: totalOrders,
      color: "#ffe0b2",
      icon: <ListAltIcon fontSize="large" />,
    },
    {
      label: "Total Sales",
      value: `$${totalSales.toFixed(2)}`,
      color: "#d1c4e9",
      icon: <AttachMoneyIcon fontSize="large" />,
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* ---------- Cards ---------- */}
      <Grid container spacing={2}>
        {cardsData.map((card, idx) => (
          <Grid key={idx}>
            <Card
              style={{
                borderRadius: "15px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                backgroundColor: card.color,
                textAlign: "center",
                padding: "20px",
                transition: "transform 0.2s",
              }}
              className="hover-card"
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "10px",
                  }}
                >
                  {card.icon}
                </div>
                <Typography variant="h6" gutterBottom>
                  {card.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ---------- Best Product ---------- */}
      <Card
        style={{
          marginTop: 20,
          padding: 20,
          borderRadius: 10,
          boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
        }}
      >
        <Typography variant="h6" fontWeight="bold" style={{ marginBottom: 15 }}>
          Best Selling Products
        </Typography>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Object.entries(productSalesCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([title, sold]) => {
              const product = products.find((p) => p.title === title);
              const image =
                product?.image_urls && product.image_urls.length > 0
                  ? product.image_urls[0].startsWith("http")
                    ? product.image_urls[0]
                    : `/assets/${product.image_urls[0]}`
                  : "/assets/home.png";

              return (
                <div
                  key={title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: 10,
                    borderRadius: 8,
                    boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
                  }}
                >
                  <img
                    src={image}
                    alt={title}
                    style={{
                      width: 50,
                      height: 50,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                  <div>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {sold} sold
                    </Typography>
                  </div>
                </div>
              );
            })}
        </div>
      </Card>

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
                .sort(
                  (a, b) =>
                    new Date(b.created_at).getTime() -
                    new Date(a.created_at).getTime()
                )
                .slice(0, 5)
                .map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>{order.user_id}</TableCell>
                    <TableCell>
                      {order.products
                        .map((p) => `${p.title} (${p.quantity})`)
                        .join(", ")}
                    </TableCell>
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
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime()
                )
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
