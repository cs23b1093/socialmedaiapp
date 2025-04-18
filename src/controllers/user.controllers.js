import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/errorHandler.js";
import { uploadonCloudinary } from "../utils/Cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

// Fixed function name and implementation
const generateAccessAndRefreshTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        
        if (!user) {
            throw new apiError(404, "User not found");
        }
        
        const accessToken = user.genrateAccessToken(); 
        const refreshToken = user.genrateAccessToken();
        
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        
        return { accessToken, refreshToken };
    } catch (error) {
        throw new apiError(500, "Error generating tokens: " + error.message);
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // Input form body
    const { fullName, email, password, userName } = req.body;
    console.log(`User: ${fullName}, Email: ${email}, Password: ${password}`);

    if ([fullName, email, password, userName].some((field) => field?.trim() === "")) {
        throw new apiError(400, "All fields are required!");
    }

    const existedUser = await User.findOne({ $or: [{ email }, { userName }] });
    if (existedUser) throw new apiError(409, "User already exists!");

    const Avatar = req.files?.avatar?.[0]?.path;
    const CoverImage = req.files?.coverImage?.[0]?.path;
    console.log(`Avatar: ${Avatar}, CoverImage: ${CoverImage}`);

    if (!Avatar || !CoverImage) {
        throw new apiError(400, "Avatar and CoverImage are required!");
    }

    const uploadedAvatar = await uploadonCloudinary(Avatar);
    const uploadedCoverImage = await uploadonCloudinary(CoverImage);

    if (!uploadedAvatar || !uploadedCoverImage) {
        throw new apiError(400, "Failed to upload Avatar or CoverImage!");
    }

    const user = await User.create({
        fullName,
        email,
        password,
        userName, // Consistent naming
        avatar: uploadedAvatar.url,
        coverImage: uploadedCoverImage.url,
    });

    // Fixed variable name to match what was created above
    if (!user) throw new apiError(402, "User was not created!");

    // Get user without password
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    res.status(200).json(new apiResponse(200, createdUser, "User created successfully!"));
});

const loginUser = asyncHandler(async (req, res) => {
    // Extract credentials - use consistent naming
    const { email, userName, password } = req.body; // Match schema field name
    console.log("Login attempt:", email || userName);
    
    // Validate required fields
    if ((!userName && !email) || !password) {
        throw new apiError(400, "Username/email and password are required");
    }
    
    // Find user - make sure field names match your schema
    const user = await User.findOne({
        $or: [{ userName }, { email }]  // Using userName to match schema
    });
    
    // Check if user exists
    if (!user) {
        throw new apiError(404, "User does not exist");
    }
    
    // Validate password
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new apiError(401, "Invalid user credentials");
    }
    
    // Generate tokens - use the corrected function name
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    
    // Add debugging log
    console.log("Generated tokens:", { 
        accessTokenExists: !!accessToken, 
        refreshTokenExists: !!refreshToken 
    });
    console.log(accessToken);
    // Get user data without sensitive info
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
    
    // Set cookie options
    const options = {
        httpOnly: true,
        secure: false
    };
    // Send response
    
    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            {
                "user": loggedInUser,
                "access_token": accessToken,
                "refresh_token": refreshToken
            }
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    try {
        // Get user ID from authenticated request
        const userId = req.user?._id;
        console.log("cookies are: ", req.cookies);
        if (!userId) {
            throw new apiError(401, "Unauthorized access");
        }
        
        // Remove refresh token from database
        await User.findByIdAndUpdate(
            userId,
            {
                $set: { refreshToken: undefined }
            },
            {
                new: true
            }
        );
        
        // Clear cookies
        const options = {
            httpOnly: true,
            secure: true
        };
        
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(
                new apiResponse(200, {}, "Logged out successfully")
            );
    } catch (error) {
        throw new apiError(500, "Error during logout: " + error.message);
    }
});

export { registerUser, loginUser, logoutUser };