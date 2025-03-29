import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    comments: [
        mongoose.Schema.Types.ObjectId,
        ref= "comments"
],
    video:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        index: true
    },
    likeBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    tweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
    },
}, {
    timestamps: true
})

export const Like = mongoose.model("Like", likeSchema);