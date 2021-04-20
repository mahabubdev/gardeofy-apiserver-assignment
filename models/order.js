const { model, Schema } = require('mongoose');


const orderSchema = new Schema({
    uid: {
        type: String,
        unique: true,
        required: true,
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service'
    },
    info: {
        type: Object,
    },
    status: {
        type: String,
        default: 'pending'
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});


module.exports = model('Order', orderSchema);