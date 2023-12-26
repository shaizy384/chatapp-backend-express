const mongoose = require("mongoose")

const connectDb = async() => {
    
    try {
        let connect = await mongoose.connect(process.env.CONNECTION_STRING)
        console.log('Database connected ', connect.connection.host, connect.connection.name);
    } catch (error) {
        console.log('Error in connecting Database: ', error);
    }
}

module.exports = connectDb