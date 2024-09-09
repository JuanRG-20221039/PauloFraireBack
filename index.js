import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';


// import routes
import academyActivitiesRoutes from './routes/academyActivitiesRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import customsizeRoutes from './routes/customsizeRoutes.js';
import imageActivityRoutes from './routes/imageActivityRoutes.js';
import userRoutes from './routes/userRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

const app = express();
dotenv.config();
// withelist frontend url

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const whitelist = [process.env.FRONTEND_URL];

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


app.get('/', (req, res) => {
    res.send('Hello World');
});

//Routes
app.use('/api', academyActivitiesRoutes);
app.use('/api', blogRoutes);
app.use('/api', customsizeRoutes);
app.use('/api', imageActivityRoutes);
app.use('/api', userRoutes);
app.use('/api', contactRoutes);


const PORT = process.env.PORT || 5000;

const servidor = app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});