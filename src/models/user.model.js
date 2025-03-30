import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    watchHistory: [
            type= mongoose.Schema.type.ObjectId,
            ref = "Video"
        ],
    email: {
        type: String,
        required: {
            value: true, 
            message: "Email is required",
        },
        unique: {value: true, message: "Email already exists"},
        trim: true,
        lowercase: true,
        index: true,
    },
    userName: {
        type: String,
        required: {value: true, message: "Username is required"},
        unique: {value: true, message: "Username already exists"},
        trim: true,
        lowercase: true,
        index: true
    },
    fullName: {
        type: String,
        required: {value: true, message: "full Name is required"},
        trim: true,
        index: true,
    },
    coverImage: {
        type: String
    },
    password: {
        type: String,
        required: {value: true, message: "password is required"},
        trim: true,
        lowercase: true,
        unique: {value: true, message: "password already exists"},
    },
    avtar: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    
}, {timestamps: true});

userSchema.pre("save", async function(next) {
    this.password = bcrypt.hash(this.password, 10, (err, result) => {
        err? console.error("ERROR: ", err) : console.log(result);
    })
})
userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password, this.password, (err, result) => {
        if(err) throw err;
        console.log(result? "password correct" : "password incorrect");
    })
}

userSchema.methods.genrateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        fullName: this.fullName,
        email: this.email,
        userName: this.userName,
    },
        process.env.ACCESS_TOCKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOCKEN_EXPIRY
        }
    )
}

userSchema.methods.genrateRefreshToken = function () {
    return jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOCKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOCKEN_EXPIRY
        }

    )
}

export const  User = mongoose.model("User", userSchema);