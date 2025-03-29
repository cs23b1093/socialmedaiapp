import mongoose from "mongoose";

const tweetSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    content: {
        type: String,
        required: {
                value: true,
                message: "Content is required!"
        }
    },
}, {
    timestamps: true
})