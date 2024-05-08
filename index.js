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

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dotenv.config();

app.get('/', (req, res) => {
    res.send('Hello World');
});

//Routes
app.use('/api', academyActivitiesRoutes);
app.use('/api', blogRoutes);
app.use('/api', customsizeRoutes);
app.use('/api', imageActivityRoutes);
app.use('/api', userRoutes);


connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});