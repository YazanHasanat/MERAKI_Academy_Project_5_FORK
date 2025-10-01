import { Card, CardContent, Stack, Typography } from "@mui/material";

type OrderType = {
  id: number;
  created_at: string;
  updated_at?: string; // مهم للترتيب حسب آخر تحديث
  total_price: string;
  status: string;
  full_name: string;
  address: string;
  driver_id?: number;
};

type CompletedOrdersProps = {
  orders: OrderType[];
  driverId?: number;
};

export default function CompletedOrders({ orders, driverId }: CompletedOrdersProps) {
  // فلترة الأوردرات المكتملة للسائق وترتيبها حسب آخر تحديث
  const myCompletedOrders = orders
    .filter(order => order.driver_id === driverId && order.status === "completed")
    .sort((a, b) => {
      const updatedA = new Date(a.updated_at || a.created_at).getTime();
      const updatedB = new Date(b.updated_at || b.created_at).getTime();
      return updatedB - updatedA; // تنازلي: آخر تحديث أولًا
    });

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 5 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", color: "#333" }}>
          ✅ Completed Orders
        </Typography>

        {myCompletedOrders.length === 0 ? (
          <Typography>No completed orders</Typography>
        ) : (
          <Stack spacing={2}>
            {myCompletedOrders.map(order => (
              <Card
                key={order.id}
                sx={{ p: 2, borderRadius: 2, border: "1px solid #eee", bgcolor: "#fafafa" }}
              >
                <Typography variant="body1">Order #{order.id}</Typography>
                <Typography variant="body2">Address: {order.address}</Typography>
                <Typography variant="body2" color="gray">Total: ${order.total_price}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Last updated: {order.updated_at ? new Date(order.updated_at).toLocaleString() : new Date(order.created_at).toLocaleString()}
                </Typography>
              </Card>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
