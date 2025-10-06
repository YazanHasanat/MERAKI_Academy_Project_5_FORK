"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
require("dotenv").config();
require("./models/db");
const app = express();
const PORT = process.env.PORT || 5000;
// Import Routers
const productRouter = require("./routes/productRoute");
const categoryRouter = require("./routes/CategoryRoute");
const rolesRouter = require("./routes/rolesRoute");
const usersRouter = require("./routes/usersRoute");
const cartRouter = require("./routes/cartRoute");
const orderRouter = require("./routes/orderRoute");
const locationRouter = require("./routes/userLocationRoute");
//built-in middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(express.json());
//srtibe
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
app.post("/create-payment-intent", async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
        });
        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to create payment intent" });
    }
});
// Routes Middleware
app.use("/products", productRouter);
app.use("/categories", categoryRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);
app.use("/roles", rolesRouter);
app.use("/users", usersRouter);
app.use("/location", locationRouter);
// Handles any other endpoints [unassigned - endpoints]
app.use((req, res) => res.status(404).json("NO content at this path"));
app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map