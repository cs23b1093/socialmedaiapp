import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { apiError } from "../utils/errorHandler.js";
import { uploadonCloudinary } from "../utils/Cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.genrateAccessToken()
        const refreshToken = user.genrateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new apiError(500, error.message)
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
    let Avatar = null;
    let CoverImage = null;
    try {
        Avatar = req.files?.avatar?.[0]?.path;
        CoverImage = req.files?.coverImage?.[0]?.path;
    } catch (error) {
        console.log("error is here: ", error);
    }
    console.log(`Avatar: ${Avatar}, CoverImage: ${CoverImage}`);

    if (!Avatar || !CoverImage) {
        throw new apiError(400, "Avatar and CoverImage are required!");
    }

    let uploadedAvatar = null;
    let uploadedCoverImage = null;

    try {
        uploadedAvatar = await uploadonCloudinary(Avatar);
        uploadedCoverImage = await uploadonCloudinary(CoverImage);
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw new apiError(500, "Error uploading images to Cloudinary.");
    }

    if (!uploadedAvatar || !uploadedCoverImage) {
        throw new apiError(400, "Failed to upload Avatar or CoverImage!");
    }

    const user = await User.create({
        fullName,
        email,
        password,
        userName,
        avatar: uploadedAvatar.url,
        coverImage: uploadedCoverImage.url,
    });

    const userCreated = await User.findById(user._id).select('+refreshToken');

    if (!userCreated) throw new apiError(402, "User was not created!");

    res.status(200).json(new apiResponse(userCreated, "User created successfully!"));
});

const loginUser = asyncHandler(async (req, res) =>{
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    const {email, username, password} = req.body
    

    if (!username && !email) {
        throw new apiError(400, "username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if (!user) {
        throw new apiError(404, "User does not exist")
    }

   const isPasswordValid = await user.isPasswordCorrect(password)

   if (!isPasswordValid) {
    throw new apiError(401, "Invalid user credentials")
    }

   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    console.log("accessToken: ", accessToken)
    console.log("refreshToken: ", refreshToken)
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new apiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )

})

const logoutUser = asyncHandler( async (req, res) => {
    // find user
    // remove refresh token from user
    // clear cookies
    // send response
})

export { registerUser, loginUser, logoutUser };
