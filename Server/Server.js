const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const { sequelize, connectDB } = require("./config/database");
const UserRoute = require("./Routes/UserRoute");
const VerificationCodeRoute = require("./Routes/VerificationCodeRote");
const SocialRoute = require("./Routes/SocialRoute");
const WebsiteSettingsRoute = require('./Routes/WebsiteSettingsRoute')
const CompanyInfoRoute = require('./Routes/CompanyInfoRoute')
const UsersFolowedRoute = require('./Routes/UsersFolowedRoute')
const ProductsRoute = require('./Routes/ProductsRoute')

// const { User } = require("lucide-react");

// Routes


// Initialize app
const app = express();
 
// Allowed origins
const allowedOrigins = [
//   "https://ahmedtl.com",
//   "https://www.ahmedtl.com",
  "http://localhost:5173", 
  "*", 
  "https://e-commerce-website-f.vercel.app"
];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error("Not allowed by CORS"));
    }, 
    credentials: true,
  })
); 

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "https://e-commerce-website-f.vercel.app");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
//   next();
// });

// Rate limiting
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

// === Root route ===
app.get("/", async (req, res) => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true })
    console.log("✅ Database connected");
    res.status(200).send("✅ API running and database connected");
  } catch (err) {
    console.error("❌ Database error:", err.message);
    res.status(500).send("Database connection failed: " + err.message);
  }
});



// === API routes ===
app.use("/api/user",UserRoute);
app.use("/api/user/verification",VerificationCodeRoute);
app.use("/api/user/socials",SocialRoute);
app.use("/api/webSiteSettings",WebsiteSettingsRoute);
app.use("/api/followers",UsersFolowedRoute)
// app.use("/api/webSiteinfo",CompanyInfoRoute);
app.use("/api/products",ProductsRoute)

// === Handle 404 ===
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

// === Start Server === 
const PORT = process.env.PORT || 3000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  }); 
});
