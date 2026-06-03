const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const memberRoutes = require("./routes/memberRoutes");

require("dotenv").config();

const attendanceRoutes = require("./routes/attendanceRoutes");

const app = express();
const server = http.createServer(app);

// =======================
// SOCKET.IO SETUP
// =======================
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("🟢 Client connected:", socket.id);
});

// make io available globally
app.set("io", io);

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// =======================
// ROUTES
// =======================
app.use("/api", attendanceRoutes);
app.use("/api/members", memberRoutes);

// =======================
// DB
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// =======================
app.get("/", (req, res) => {
  res.send("Server Running");
});

// =======================
server.listen(process.env.PORT || 5000, "0.0.0.0", () => {
  console.log("Server started on port 5000");
});