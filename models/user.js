const { model, Schema } = require('mongoose');


const userSchema = new Schema({
    name: {
        type: String,
        minLength: 6,
        maxLength: 32,
        required: true
    },
    email: {
        type: String,
        minLength: 10,
        maxLength: 32,
        required: true,
        unique: true
    },
    photo: {
        type: String,
        default: 'user.png'
    },
    role: {
        type: String,
        default: 'customer'
    },
    orders: [{
        type: Schema.Types.ObjectId,
        ref: 'Order'
    }],
    review: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, {timestamps: true});


module.exports = model('User', userSchema);