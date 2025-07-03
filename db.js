const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const URI = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);

const connectToMongo = async () => {
    if (!URI) {
        console.error("MONGODB_URL not set in environment variables.");
        process.exit(1);
    }
    try {
        await mongoose.connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to Mongo Successfully");
    } catch (error) {
        console.error("Failed to connect to Mongo:", error);
        process.exit(1);
    }
};

module.exports = connectToMongo;