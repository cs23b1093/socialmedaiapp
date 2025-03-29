import mongoose from mongoose;

const playlistSchema = mongoose.Schema({
    name: {
        type : String,
        required: {
            value: true,
            message: "Name is Required"
        }
    },
    description: {
        type: String,
        required: {
            value: true,
            message: "Description is Required"
        },
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

export const Playlist = mongoose.model('Playlist', playlistSchema);