"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ResponsivePie } from "@nivo/pie";
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
  useTheme,
  useMediaQuery,
  Box,
  Tabs,
  Tab,
  TableContainer,
} from "@mui/material";
import { TabContext, TabPanel } from "@mui/lab";

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
};
type User = { id: number; firstname: string; email: string; createdAt: string };
type BestUser = {
  id: number;
  firstname: string;
  email: string;
  ordersCount: number;
  totalSpent: number;
};

export default function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [tabValue, setTabValue] = useState("1");
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes, orderRes, userRes] = await Promise.all([
          axios.get("https://meraki-academy-project-5-xtxg.onrender.com/categories"),
          axios.get("https://meraki-academy-project-5-xtxg.onrender.com/products"),
          axios.get("https://meraki-academy-project-5-xtxg.onrender.com/orders/info"),
          axios.get("https://meraki-academy-project-5-xtxg.onrender.com/get"),
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
                ...p,
                price: parseFloat(p.price),
                categoryId: prodInfo?.category_id,
              };
            }
          );
          const total_price = detailedProducts.reduce(
            (sum, p) => sum + p.price * p.quantity,
            0
          );
          return {
            ...order,
            id: order.order_id,
            products: detailedProducts,
            total_price,
          };
        });

        setOrders(enrichedOrders);
        setUsers(userRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // ---------- Stats ----------
  const totalCategories = categories.length;
  const totalProducts = products.length;
  const totalUsers = users.length;
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + o.total_price, 0);

  // ---------- Product Sales ----------
  const productSalesCount: Record<string, number> = {};
  orders.forEach((o) =>
    o.products.forEach(
      (p) =>
        (productSalesCount[p.title] =
          (productSalesCount[p.title] || 0) + p.quantity)
    )
  );

  // ---------- Cards ----------
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

  // ---------- Best Users ----------
  const bestUsers: BestUser[] = users
    .map((user) => {
      const userOrders = orders.filter((o) => o.user_id === user.id);
      return {
        id: user.id,
        firstname: user.firstname,
        email: user.email,
        ordersCount: userOrders.length,
        totalSpent: userOrders.reduce((sum, o) => sum + o.total_price, 0),
      };
    })
    .sort((a, b) => b.totalSpent - a.totalSpent)
    .slice(0, 5);

  const categorySalesCount: Record<string, number> = {};
  orders.forEach((o) =>
    o.products.forEach((p) => {
      const category = categories.find((c) => c.id === p.categoryId);
      if (category) {
        categorySalesCount[category.name] =
          (categorySalesCount[category.name] || 0) + p.quantity;
      }
    })
  );

  const pieData = Object.entries(categorySalesCount).map(
    ([category, value]) => ({
      id: category,
      label: category,
      value,
    })
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
    <div style={{ padding: isMobile ? 10 : 20 }}>
      {/* ---------- Cards ---------- */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "space-between",
        }}
      >
        {cardsData.map((card, idx) => (
          <div
            key={idx}
            style={{
              flex: isMobile ? "1 1 40%" : "1 1 18%",
              minWidth: isMobile ? 140 : 150,
              opacity: 0,
              transform: "translateY(20px)",
              animation: `fadeInUp 1s ease forwards`,
              animationDelay: `${idx * 0.1}s`,
            }}
          >
            <Card
              style={{
                borderRadius: 15,
                boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                backgroundColor: card.color,
                textAlign: "center",
                padding: isMobile ? 15 : 20,
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
              }}
              className="hover-card"
            >
              <CardContent>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  {card.icon}
                </div>
                <Typography variant={isMobile ? "body1" : "h6"} gutterBottom>
                  {card.label}
                </Typography>
                <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* ---------- Mobile View with Tabs ---------- */}
      {isMobile ? (
        <Box sx={{ width: '100%', mt: 3 }}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
                <Tab label="Products" value="1" />
                <Tab label="Orders" value="2" />
                <Tab label="Users" value="3" />
                <Tab label="Categories" value="4" />
              </Tabs>
            </Box>
            
            <TabPanel value="1">
              <Card style={{ padding: 15, borderRadius: 10, marginTop: 10 }}>
                <Typography variant="h6" fontWeight="bold" style={{ marginBottom: 15 }}>
                  Best Selling Products
                </Typography>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {Object.entries(productSalesCount)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 5)
                    .map(([title, sold]) => {
                      const product = products.find((p) => p.title === title);
                      const image = product?.image_urls?.[0]?.startsWith("http")
                        ? product.image_urls[0]
                        : `/assets/${product?.image_urls?.[0] || "home.png"}`;
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
            </TabPanel>
            
            <TabPanel value="2">
              <Card style={{ padding: 15, borderRadius: 10, marginTop: 10 }}>
                <Typography variant="h6">Last 5 Orders</Typography>
                <TableContainer component={Box} sx={{ maxHeight: 300, mt: 2 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>User</TableCell>
                        <TableCell>Total</TableCell>
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
                            <TableCell>${order.total_price.toFixed(2)}</TableCell>
                            <TableCell>{order.status}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </TabPanel>
            
            <TabPanel value="3">
              <Card style={{ padding: 15, borderRadius: 10, marginTop: 10 }}>
                <Typography variant="h6">Top 5 Users</Typography>
                <TableContainer component={Box} sx={{ maxHeight: 300, mt: 2 }}>
                  <Table size="small" stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Orders</TableCell>
                        <TableCell>Spent</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {bestUsers.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell>{u.firstname}</TableCell>
                          <TableCell>{u.ordersCount}</TableCell>
                          <TableCell>${u.totalSpent.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </TabPanel>
            
            <TabPanel value="4">
              <Card style={{ padding: 15, borderRadius: 10, marginTop: 10, height: 400 }}>
                <Typography variant="h6" fontWeight="bold" style={{ marginBottom: 15 }}>
                  Best Selling Categories
                </Typography>
                <div style={{ height: 320 }}>
                  <ResponsivePie
                    data={pieData}
                    margin={{ top: 40, right: 20, bottom: 80, left: 20 }}
                    innerRadius={0.5}
                    padAngle={0.6}
                    cornerRadius={2}
                    activeOuterRadiusOffset={8}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#333333"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: "color" }}
                    arcLabelsSkipAngle={10}
                    arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                    legends={[
                      {
                        anchor: "bottom",
                        direction: "row",
                        translateY: 56,
                        itemWidth: 80,
                        itemHeight: 18,
                        symbolShape: "circle",
                        itemTextColor: "#333",
                      },
                    ]}
                  />
                </div>
              </Card>
            </TabPanel>
          </TabContext>
        </Box>
      ) : (
        // ---------- Desktop View (Original) ----------
        <>
          {/* ---------- Best Selling Products ---------- */}
          <Card
            style={{
              marginTop: 20,
              padding: 20,
              borderRadius: 10,
              boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
              animation: "fadeInUp 0.6s ease forwards",
              animationDelay: "0.6s",
            }}
          >
            <Typography variant="h6" fontWeight="bold" style={{ marginBottom: 15 }}>
              Best Selling Products
            </Typography>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {Object.entries(productSalesCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([title, sold], idx) => {
                  const product = products.find((p) => p.title === title);
                  const image = product?.image_urls?.[0]?.startsWith("http")
                    ? product.image_urls[0]
                    : `/assets/${product?.image_urls?.[0] || "home.png"}`;
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
                        opacity: 0,
                        transform: "translateX(-10px)",
                        animation: "rowFadeIn 0.4s ease forwards",
                        animationDelay: `${idx * 0.2}s`,
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

          {/* ---------- Last 5 Orders ---------- */}
          <Card
            style={{
              marginTop: 20,
              animation: "fadeInUp 0.6s ease forwards",
              animationDelay: "1s",
            }}
          >
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
                    .map((order, idx) => (
                      <TableRow
                        key={order.id}
                        style={{
                          opacity: 0,
                          transform: "translateX(-10px)",
                          animation: "rowFadeIn 0.4s ease forwards",
                          animationDelay: `${idx * 0.1}s`,
                        }}
                      >
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

          {/* ---------- Best Users Table ---------- */}
          <Card
            style={{
              marginTop: 20,
              animation: "fadeInUp 0.6s ease forwards",
              animationDelay: "1.3s",
            }}
          >
            <CardContent>
              <Typography variant="h6">Top 5 Users by Total Spent</Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Orders Count</TableCell>
                    <TableCell>Total Spent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bestUsers.map((u, idx) => (
                    <TableRow
                      key={u.id}
                      style={{
                        opacity: 0,
                        transform: "translateX(-10px)",
                        animation: "rowFadeIn 0.4s ease forwards",
                        animationDelay: `${idx * 0.1}s`,
                      }}
                    >
                      <TableCell>{u.id}</TableCell>
                      <TableCell>{u.firstname}</TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>{u.ordersCount}</TableCell>
                      <TableCell>${u.totalSpent.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          {/* ---------- Pie Chart by Category ---------- */}
          <Card
            style={{ marginTop: 20, padding: 20, borderRadius: 10, height: 400 }}
          >
            <Typography variant="h6" fontWeight="bold" style={{ marginBottom: 15 }}>
              Best Selling Categories
            </Typography>
            <div style={{ height: 320 }}>
              <ResponsivePie
                data={pieData}
                margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
                innerRadius={0.5}
                padAngle={0.6}
                cornerRadius={2}
                activeOuterRadiusOffset={8}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="#333333"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: "color" }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
                legends={[
                  {
                    anchor: "bottom",
                    direction: "row",
                    translateY: 56,
                    itemWidth: 100,
                    itemHeight: 18,
                    symbolShape: "circle",
                  },
                ]}
              />
            </div>
          </Card>
        </>
      )}

      {/* ---------- Animations CSS ---------- */}
      <style>{`
        @keyframes fadeInUp {
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes rowFadeIn {
          to { opacity: 1; transform: translateX(0); }
        }
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.25);
        }
      `}</style>
    </div>
  );
}