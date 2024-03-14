const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const router = require("./routes/userRouter");
require("dotenv").config();
require("cookie-parser");

const app = express();
app.use(express.json());
app.use("/auth", router);
app.use(
  cors({
    origin: ["http://localhost:5173"]  })
);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.listen(process.env.PORT, () => {
  console.log("Server is running");
});
