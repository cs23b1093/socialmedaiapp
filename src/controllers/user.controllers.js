import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/errorHandler.js";

const registerUser = asyncHandler( async (req, res) => {
        // extract data from fronted
        // check any data is empty or not
        // chek if user is already exist or not
        // check user have avtar or not 
        // upload them to cloudinary
        // create user in database
        // extract the password and token from response 
        // send response to frontend
        const {fullName, email, password, userName} = req.body
        console.log(`fullName is: ${fullName}, email is: ${email} and passwrod is: ${password} and userName is: ${userName}`);
        
        if([fullName, email, password, userName].some((field) => field?.trim() === "")) {
                throw new apiError(409,"Please fill all the fields");
        }
    })

export default registerUser;
