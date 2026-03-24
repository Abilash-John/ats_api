const { DataSource } = require("typeorm");
require("dotenv").config();

const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "secret",
    database: process.env.DB_NAME || "ats_db",
    synchronize: process.env.NODE_ENV === "development",
    logging: process.env.NODE_ENV === "development",
    entities: [__dirname + "/../entities/*.js"],
    migrations: [__dirname + "/../migrations/*.js"],
});

const connectDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log("✅ Successfully connected to MySQL via TypeORM (Node.js).");
    } catch (error) {
        console.error("❌ Unable to connect to the database:", error.message);
        process.exit(1);
    }
};

module.exports = { AppDataSource, connectDB };
