// const mongoose = require('mongoose');
import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();

const connectDB = async() =>{
    try{
      const connect = await mongoose.connect(process.env.MONGO_URI);
      console.log("DataBase Connected");

      return connect.connection.db;
    }catch{
     console.error("connection failed");
     process.exit(1);
    }
      
}

export default  connectDB;