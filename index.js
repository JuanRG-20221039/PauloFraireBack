//index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// import routes
import academyActivitiesRoutes from "./routes/academyActivitiesRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import customsizeRoutes from "./routes/customsizeRoutes.js";
import imageActivityRoutes from "./routes/imageActivityRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import validateTokenRoutes from "./routes/validateTokenRoutes.js"; // de main
import politicasRoutes from "./routes/politicasRoutes.js"; // de marvin
import deslindeRoutes from "./routes/deslindeRoutes.js"; // de marvin
import terminosRoutes from "./routes/terminosRoutes.js"; // de marvin
import socialRoutes from "./routes/socialLinkRoutes.js";
import sloganRoutes from "./routes/sloganRoutes.js";
import logoRoutes from "./routes/logoRoutes.js";
import headerTitleRoutes from "./routes/headerTitleRoutes.js";
const app = express();
dotenv.config();
// withelist frontend url

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const whitelist = "http://localhost:5173";

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      // Puede consultar la API
      callback(null, true);
    } else {
      // No esta permitido
      callback(new Error("Error de Cors"));
    }
  },
};

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World");
});

//Routes
app.use("/api", academyActivitiesRoutes);
app.use("/api", blogRoutes);
app.use("/api", customsizeRoutes);
app.use("/api", imageActivityRoutes);
app.use("/api", userRoutes);
app.use("/api", contactRoutes);
app.use("/api", validateTokenRoutes); // de main
//--------------------para la parte de aceca de----------------------------------------------------------------
app.use("/api", politicasRoutes); // de marvin
app.use("/api", deslindeRoutes); // de marvin
app.use("/api", terminosRoutes); // de marvin
//--------------------para la parte de aceca de----------------------------------------------------------------
//--------------------------------------------Para slogan, logo y tituto de la pagina--------------------------
app.use("/api", sloganRoutes);
app.use("/api", logoRoutes);
app.use("/api", headerTitleRoutes);
//--------------------------------------------Para slogan, logo y tituto de la pagina--------------------------

const PORT = 8000;

const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
