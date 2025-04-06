import { apiError } from "../utils/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";

export const extractAccessToken = asyncHandler( async (req, _ , next) => {
    try {
        const access_Token = req.cooies?.accessToken || req.headers["authorization"]?.split(" ")[1] || req.body.accessToken || req.query.accessToken
        if (!access_Token) {
            throw apiError(401, "Access token is required!")
        }
        const decode = jwt.verify(access_Token, process.env.JWT_SECRET_KEY)
        if (!decode) {
            throw new apiError(401, "Invalid access token!")
        }
        const user = await User.findById(decode._id).select("-password -refreshToken")
        if (!user) {
            throw new apiError(401, "User does not exist!")
        }
        req.user = user
        next()
    } catch (error) {
        throw new apiError(401, error.message || "Invalid access token!")
    }
})