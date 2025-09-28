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
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Category = { id: string; name: string };
type Product = { id: number; name: string; categoryId: string; price: number };
type OrderProduct = {
  product_id: number;
  quantity: number;
  name?: string;
  price?: number;
  categoryId?: string;
};
type Order = {
  id: number;
  products: OrderProduct[];
  total_price: number;
  created_at: string;
  status: string;
  user_id: number;
};
type User = { id: number; name: string; email: string; createdAt: string };

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
          axios.get("http://localhost:5000/orders"),
          axios.get("http://localhost:5000/users/get"),
        ]);

        setCategories(catRes.data);
        setProducts(prodRes.data.products);

        // ربط المنتجات داخل كل order مع بيانات المنتج الفعلية
        const enrichedOrders: Order[] = orderRes.data.orders.map(
          (order: Order) => {
            const detailedProducts = order.products.map((p: OrderProduct) => {
              const prodInfo = prodRes.data.products.find(
                (prod: Product) => prod.id === p.product_id
              );
              return {
                ...p,
                name: prodInfo?.name || "Unknown",
                price: prodInfo?.price || 0,
              };
            });
            return { ...order, products: detailedProducts };
          }
        );
        setOrders(enrichedOrders);

        setUsers(userRes.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  // ----------- حساب الإحصائيات ------------
  const totalCategories = categories.length;
  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalSales = orders.reduce(
    (sum, o) => sum + parseFloat(o.total_price.toString()),
    0
  );

  // أكثر منتج مبيعًا
  const productSalesCount: Record<string, number> = {};
  orders.forEach((o) => {
    o.products.forEach((p) => {
      productSalesCount[p.name!] =
        (productSalesCount[p.name!] || 0) + p.quantity;
    });
  });
  const bestProduct = Object.entries(productSalesCount).sort(
    (a, b) => b[1] - a[1]
  )[0];

  // مبيعات حسب الكاتيجوري
  const categorySales: { category: string; sales: number }[] = [];
  const catSalesMap: Record<string, number> = {};
  orders.forEach((o) => {
    o.products.forEach((p) => {
      const catName =
        categories.find((c) => c.id === p.categoryId)?.name || "Other";
      catSalesMap[catName] =
        (catSalesMap[catName] || 0) + p.price! * p.quantity;
    });
  });
  for (const [category, sales] of Object.entries(catSalesMap)) {
    categorySales.push({ category, sales });
  }

  // مبيعات حسب الشهر
  const salesByMonth: { month: string; sales: number }[] = [];
  const monthMap: Record<string, number> = {};
  orders.forEach((o) => {
    const month = new Date(o.created_at).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    monthMap[month] =
      (monthMap[month] || 0) + parseFloat(o.total_price.toString());
  });
  for (const [month, sales] of Object.entries(monthMap)) {
    salesByMonth.push({ month, sales });
  }

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f"];

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

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
            <Typography>
              {bestProduct[0]} - {bestProduct[1]} sold
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* ---------- Charts ---------- */}
      <Grid container spacing={2} style={{ marginTop: 20 }}>
        {/* Pie Chart - Category Sales */}
        <Grid>
          <Card>
            <CardContent>
              <Typography variant="h6">Sales by Category</Typography>
              <PieChart width={300} height={300}>
                <Pie
                  data={categorySales}
                  dataKey="sales"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {categorySales.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>

        {/* Bar Chart - Sales by Month */}
        <Grid>
          <Card>
            <CardContent>
              <Typography variant="h6">Sales by Month</Typography>
              <BarChart width={400} height={300} data={salesByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#82ca9d" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

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
                        .map((p) => `${p.name} (${p.quantity})`)
                        .join(", ")}
                    </TableCell>
                    <TableCell>${order.total_price}</TableCell>
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
                    <TableCell>{u.name}</TableCell>
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
