const mongoose = require("mongoose");
const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/orchards";

function connectDb() {
    mongoose.connect(dbUrl)
        .then(() => console.log("connected to DB"))
        .catch((err) => console.log("failed to connect DB", err))
}

module.exports = {
    dbUrl,
    connectDb
}