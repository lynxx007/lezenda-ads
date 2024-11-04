import mongoose from "mongoose";
import 'dotenv/config'

const uri : string = process.env.MONGO_URI ?? ''


const connectDb = async()=>{
    try {
        const connect = await mongoose.connect(uri,{dbName:process.env.DB_NAME});
        console.log(`MongoDB connected: ${connect.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}
export default connectDb