const mongoose = require('mongoose')
const dotenv = require ('dotenv')
dotenv.config ()
const URI = process.env.MONGODB_URL

mongoose.set("strictQuery", false);
const connectToMongo = () => mongoose.connect(URI, () => {
    console.log("Connected to Mongo Successfully")
})

module.exports = connectToMongo