const mongoose = require('mongoose')

const URI = 'YOUR MONGO DB URI GOES HERE'

mongoose.set("strictQuery", false);
const connectToMongo = () => mongoose.connect(URI, () => {
    console.log("Connected to Mongo Successfully")
})

module.exports = connectToMongo