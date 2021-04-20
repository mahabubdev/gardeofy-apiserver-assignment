const { model, Schema } = require('mongoose');


const serviceSchema = new Schema({
    uid: {
        type: String,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        minLength: 5,
        maxLength: 100,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        minLength: 30,
        maxLength: 255,
    },
    info: {
        price: {type: Number, default: 3600},
        currency: {type: String, default: 'CAD'},
        validity: {
            type: String,
            default: '1y'
        }
    },
    status: {
        type: Boolean,
        default: true
    }
});


module.exports = model('Service', serviceSchema);