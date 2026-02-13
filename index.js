import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";

// __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Inicializar app y DB
const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos (React build)
app.use(express.static(path.join(__dirname, "dist")));

// Manejo especial para multipart/form-data
app.use((req, res, next) => {
  const contentType = req.headers["content-type"] || "";
  const isMultipart = contentType.startsWith("multipart/form-data");

  if (isMultipart) return next();

  express.json()(req, res, (err) => {
    if (err) return res.status(400).json({ error: "Error al parsear JSON" });
    express.urlencoded({ extended: true })(req, res, next);
  });
});

// Importación de rutas
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

// Rutas propias de Marvinsh
import staffRoutes from "./routes/staffRoutes.js";
import zonasRoutes from "./routes/zonasRoutes.js";
import inscripcionesImagesRoutes from "./routes/inscripcionesImagesRoutes.js";
import inscripcionesVideoRoutes from "./routes/inscripcionesVideoRoutes.js";

// Rutas añadidas en TEST-BACK
import eventoRoutes from "./routes/eventoRoutes.js";

// Registrar rutas principales
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

// Del branch Marvinsh
app.use("/api", staffRoutes);
app.use("/api", zonasRoutes);
app.use("/api", inscripcionesImagesRoutes);
app.use("/api", inscripcionesVideoRoutes);

// Del branch TEST-BACK
app.use("/api", eventoRoutes);

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Catch-all para SPA
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
