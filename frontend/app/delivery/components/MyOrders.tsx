import { Card, CardContent, Stack, Typography, Button } from "@mui/material";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

type OrderType = {
  id: number;
  created_at: string;
  total_price: string;
  status: string;
  full_name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  driver_id?: number;
};

type MyOrdersProps = {
  orders: OrderType[];
  driverId?: number;
  handleChangeStatus: (orderId: number, newStatus: string) => void;
};

export default function MyOrders({
  orders,
  driverId,
  handleChangeStatus,
}: MyOrdersProps) {
  const myOrders = orders.filter(
    (o) => o.driver_id === driverId && o.status === "on the way"
  );

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 5 }}>
      <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
        <Typography
          variant="h5"
          gutterBottom
          sx={{ fontWeight: "bold", color: "#333" }}
        >
          📝 My Orders
        </Typography>
        {myOrders.length === 0 ? (
          <Typography>No orders found</Typography>
        ) : (
          <Stack spacing={2}>
            {myOrders.map((order) => (
              <Card
                key={order.id}
                sx={{
                  p: { xs: 1.5, sm: 2 },
                  borderRadius: 2,
                  border: "1px solid #eee",
                  bgcolor: "#fafafa",
                }}
              >
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  alignItems="flex-start"
                >
                  <AccessTimeRoundedIcon sx={{ mt: 0.5, color: "#ff9800" }} />
                  <Stack flexGrow={1}>
                    <Typography variant="body1">
                      Order #{order.id} - <strong>{order.status}</strong>
                    </Typography>

                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{
                        cursor:
                          order.latitude && order.longitude
                            ? "pointer"
                            : "default",
                        textDecoration:
                          order.latitude && order.longitude
                            ? "underline"
                            : "none",
                        wordBreak: "break-word",
                      }}
                      onClick={() => {
                        if (order.latitude && order.longitude) {
                          window.open(
                            `https://www.google.com/maps?q=${order.latitude},${order.longitude}`,
                            "_blank"
                          );
                        }
                      }}
                    >
                      Address: {order.address}
                    </Typography>

                    <Typography variant="body2" color="gray">
                      Total: ${order.total_price}
                    </Typography>

                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      spacing={1}
                      mt={1}
                    >
                      <Button
                        size="small"
                        variant="contained"
                        color="success" 
                        onClick={() =>
                          handleChangeStatus(order.id, "completed") 
                        }
                        sx={{ width: { xs: "100%", sm: "auto" } }}
                      >
                        Mark as Completed 
                      </Button>
                    </Stack>
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}