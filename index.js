import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// Convirtiendo __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar app y conexión DB
const app = express();
connectDB();

// Middleware
app.use(cors()); // Importante que vaya antes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del build de React
app.use(express.static(path.join(__dirname, "dist"))); // Asegúrate de que "dist" es tu carpeta de build

app.use((req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  const isMultipart = contentType.startsWith("multipart/form-data");

  if (isMultipart) {
    // No aplicar express.json() ni urlencoded si es una subida de archivo
    return next();
  }

  express.json()(req, res, (err) => {
    if (err) return res.status(400).json({ error: "Error al parsear JSON" });
    express.urlencoded({ extended: true })(req, res, next);
  });
});

// Rutas API
import academyActivitiesRoutes from "./routes/academyActivitiesRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import customsizeRoutes from "./routes/customsizeRoutes.js";
import imageActivityRoutes from "./routes/imageActivityRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import validateTokenRoutes from "./routes/validateTokenRoutes.js";
import politicasRoutes from "./routes/politicasRoutes.js";
import deslindeRoutes from "./routes/deslindeRoutes.js";
import terminosRoutes from "./routes/terminosRoutes.js";
import socialRoutes from "./routes/socialLinkRoutes.js";
import sloganRoutes from "./routes/sloganRoutes.js";
import logoRoutes from "./routes/logoRoutes.js";
import headerTitleRoutes from "./routes/headerTitleRoutes.js";
import contextoContemporaneoRoutes from "./routes/contextoContemporaneoRoutes.js";
import ofertaEducativaRoutes from "./routes/ofertaEducativaRoutes.js";
import pdfsCCRoutes from "./routes/pdfsCCRoutes.js";
import becaRoutes from "./routes/becaRoutes.js";
import institucioonalRoutes from "./routes/institucionalRoutes.js";
import historiaCulturaRoutes from "./routes/historiaCulturaRoutes.js";
import eventoRoutes from "./routes/eventoRoutes.js";
import badgeConfigRoutes from "./routes/badgeConfigRoutes.js";
import userBadgeRoutes from "./routes/userBadgeRoutes.js";

// Rutas
app.use("/api", academyActivitiesRoutes);
app.use("/api", blogRoutes);
app.use("/api", customsizeRoutes);
app.use("/api", imageActivityRoutes);
app.use("/api", userRoutes);
app.use("/api", contactRoutes);
app.use("/api", validateTokenRoutes);
app.use("/api", politicasRoutes);
app.use("/api", deslindeRoutes);
app.use("/api", terminosRoutes);
app.use("/api", socialRoutes);
app.use("/api", sloganRoutes);
app.use("/api", logoRoutes);
app.use("/api", headerTitleRoutes);
app.use("/api", contextoContemporaneoRoutes);
app.use("/api", pdfsCCRoutes);
app.use("/api", ofertaEducativaRoutes);
app.use("/api", becaRoutes);
app.use("/api", institucioonalRoutes);
app.use("/api", historiaCulturaRoutes);
app.use("/api", eventoRoutes);
app.use("/api", badgeConfigRoutes);
app.use("/api", userBadgeRoutes);

// Ruta raíz opcional (puedes eliminarla si no se usa)
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Catch-all para que React maneje cualquier ruta no encontrada (SPA)
app.get("/*splat", (req, res) => {
  res.sendFile(path.resolve(__dirname, "dist", "index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
