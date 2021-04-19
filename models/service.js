const { model, Schema } = require('mongoose');
const uid = require('myuid');


const serviceSchema = new Schema({
    uid: {
        type: String,
        default: uid() + '-' + uid() + '-' + uid(),
    },
    name: {
        type: String,
        minLength: 5,
        maxLength: 32,
        required: true
    },
    description: {
        type: String,
        required: true,
        minLength: 30,
        maxLength: 255,
    },
    status: {
        type: Boolean,
        default: true
    }
});


module.exports = model('Service', serviceSchema);