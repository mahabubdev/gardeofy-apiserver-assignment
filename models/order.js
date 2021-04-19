const { model, Schema } = require('mongoose');
const uid = require('myuid');


const orderSchema = new Schema({
    uid: {
        type: String,
        default: uid() + '-' + uid() + '-' + uid(),
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service'
    },
    info: {
        type: Object,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
}, {timestamps: true});


module.exports = model('Order', orderSchema);