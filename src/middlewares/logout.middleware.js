import { apiError } from "../utils/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";

// In logout.middleware.js
export const extractAccessToken = asyncHandler(async (req, res, next) => {
    console.log("Cookies received:", req.cookies);
    console.log("Headers:", req.headers.cookie);
    
    const token = 
                 req.headers.cookie?.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1]
    
    if(!token) {
        throw new apiError(401, "Unauthorized user. Please login first.");
    }
    
    try {
        const decode = jwt.verify(token, process.env.ACCESS_TOCKEN_SECRET);
        
        // Find the user in the database to ensure they exist
        const user = await User.findById(decode._id);
        if (!user) {
            throw new apiError(401, "User not found");
        }
        console.log(user)
        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        throw new apiError(401, `Authentication failed: ${error.message}`);
    }
});