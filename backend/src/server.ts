import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import articleRoutes from "./routes/articleRoutes";
import askHealthRoutes from "./routes/askHealthRoutes";

dotenv.config();

const app = express();


const PORT = process.env.PORT || 5000;

app.disable("x-powered-by");

app.use((_, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; connect-src 'self' http://localhost:5173 ws://localhost:5173"
  );
  next();
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "Health Companion API",
  });
});

app.get("/.well-known/appspecific/com.chrome.devtools.json", (_req, res) => {
  res.status(204).end();
});

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "Health Information Companion API is running",
  });
});

app.use("/api/articles", articleRoutes);
app.use("/api/ask", askHealthRoutes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`Health Companion API running on port ${PORT}`);
});