import mongoose from "mongoose";

const conectDB = async () => {
    try {
        // URI de la base de datos local
        const mongoURI = "mongodb://localhost:27017/paulo_freiredb";
        
        const conn = await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const url = `${conn.connection.host}:${conn.connection.port}`;
        console.log(`MongoDB connected: ${url} ✅`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default conectDB;
