import mongoose from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    watchHistory: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
    }],
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
    },
    avatar: {
        type: String,
        
    },
    refreshToken: {
        type: Object
    },
    
}, {timestamps: true});

userSchema.pre("save", async function(next) {
    return this.password = await bcrypt.hash(this.password, 10,)
    next()
})
userSchema.methods.isPasswordCorrect = async function (password){
    return bcrypt.compare(password, this.password, (err, result) => {
        if(err) throw err;
        console.log(result? "password correct" : "password incorrect");
    })
}

userSchema.methods.genrateAccessToken = async function () {
    return await jwt.sign({
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

userSchema.methods.genrateRefreshToken = async function () {
    const refreshToken = this.refreshToken = await jwt.sign({
        _id: this._id,
    },
        process.env.REFRESH_TOCKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOCKEN_EXPIRY
        }

    )
    console.log(refreshToken)
    this.refreshToken = refreshToken
}

export const  User = mongoose.model("User", userSchema);