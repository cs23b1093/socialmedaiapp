import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: {
            value: true,
            message: "Content is required"
        }
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

export const Comment = mongoose.model('Comment', commentSchema);