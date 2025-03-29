import mongoose from mongoose ;

const subscriptionSchema = mongoose.Schema({
    subscriber: [{
        type: mongoose.Schema.type.ObjectId,
        ref :"User"
    }],
    channel : {
        type: mongoose.Schema.type.ObjectId,
        ref : "User"
    },
}, {
    timestamps: true
})

export const Subscription = mongoose.model('Subscription', subscriptionSchema)