const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");
const eventRoutes = require("./routes/eventRoutes");
const certificateRoutes = require("./routes/CertificateRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const contactRoutes = require("./routes/ContactRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.send("Volunteer Finder Backend Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});