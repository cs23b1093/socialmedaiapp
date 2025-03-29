import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    videoFile: {
        type: String,
        required: {value: true, message: "Video file is required"},
    },
    thumbNail: {
        type: String,
        required: {value: true, message: "Thumbnail is required"},
    },
    title: {
        type: String,
        required: {value: true, message: "Title is required"},
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    description: {
        type: String,
    },
    duraation: {
        type: Number,
        required: {value: true, message: "Duration is required"},
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    views: {
        type: Number,
        default: 0,
    },
}, {timestamps: true});

export const Video =  mongoose.model("Video", videoSchema);