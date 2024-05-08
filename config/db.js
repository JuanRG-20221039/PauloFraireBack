import mongoose from "mongoose";

const conectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            // This is to avoid warnings in the console

        });
        const url = ` ${conn.connection.host} : ${conn.connection.port} `;
        console.log(`MongoDB connected: ${url} ✅`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default conectDB;