


// import mongoose from "mongoose";
// const connectDB = async () => {
//     try {
//         const mongoURI = "mongodb+srv://20221039:eKvvP6ckAX06Uyae@prueba.afe17.mongodb.net/paulo_freiredb?retryWrites=true&w=majority&appName=PRUEBA";

//         // Configuración de opciones para mejorar la estabilidad de la conexión
//         const options = {
//             serverSelectionTimeoutMS: 10000, // Timeout de selección del servidor (10 segundos)
//             socketTimeoutMS: 45000, // Timeout de socket (45 segundos)
//             connectTimeoutMS: 10000, // Timeout de conexión (10 segundos)
//             maxPoolSize: 10, // Tamaño máximo del pool de conexiones
//             minPoolSize: 2, // Tamaño mínimo del pool de conexiones
//             maxIdleTimeMS: 30000, // Tiempo máximo de inactividad (30 segundos)
//             // No usamos family: 4 para MongoDB Atlas ya que puede interferir con la conexión
//         };

//         const conn = await mongoose.connect(mongoURI, options);
//         console.log(`MongoDB Atlas connected: ${conn.connection.host} ✅`);
//     } catch (error) {
//         console.error(`Error de conexión a MongoDB: ${error.message}`);
//         process.exit(1); // Finaliza el proceso si hay un error
//     }
// };
// export default connectDB;










import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = "mongodb://127.0.0.1:27017/paulo_freiredb"; // Asegúrate de usar 127.0.0.1 para evitar problemas con IPv6

        const options = {
            serverSelectionTimeoutMS: 10000, // Timeout de selección del servidor (10 segundos)
            socketTimeoutMS: 45000, // Timeout de socket (45 segundos)
            connectTimeoutMS: 10000, // Timeout de conexión (10 segundos)
            maxPoolSize: 10, // Tamaño máximo del pool de conexiones
            minPoolSize: 2, // Tamaño mínimo del pool de conexiones
            maxIdleTimeMS: 30000, // Tiempo máximo de inactividad (30 segundos)
            family: 4 // Forzar IPv4
        };

        const conn = await mongoose.connect(mongoURI, options);
        console.log(`MongoDB connected: ${conn.connection.host}:${conn.connection.port} ✅`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Finaliza el proceso si hay un error
    }
};

export default connectDB;