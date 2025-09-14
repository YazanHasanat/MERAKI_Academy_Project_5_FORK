const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Import Routers
const productRouter = require("./routes/productRoute");
const categoryRouter = require("./routes/CategoryRoute");
const rolesRouter = require("./routes/rolesRoute");
const usersRouter = require("./routes/usersRoute");
const cartRouter = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute");


require("./models/db")

//built-in middleware
app.use(cors());
app.use(express.json());



// Routes Middleware
  app.use("/products", productRouter);
  app.use("/categories", categoryRouter);
  app.use("/cart", cartRouter);
  app.use("/orders", orderRouter);
  app.use("/roles", rolesRouter);
  app.use("/users", usersRouter);

// Handles any other endpoints [unassigned - endpoints]
app.use((req:any, res:any) => res.status(404).json("NO content at this path"));

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
