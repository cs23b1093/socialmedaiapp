import mongoose from 'mongoose';
import DB_NAME from '../constants.js';


export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}`)
        console.log(`Connected to ${connectionInstance.connection.host} database`)
    } catch (error) {
        console.error("ERROR: ", error.message)

    }
}
