const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
require("./models/db")
//built-in middleware
app.use(cors());
app.use(express.json());


app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
