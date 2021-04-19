const { model, Schema } = require('mongoose');
const uid = require('myuid');


const stuffSchema = new Schema({
    uid: {
        type: String,
        default: uid() + '-' + uid() + '-' + uid(),
    },
    name: {
        type: String,
        minLength: 6,
        maxLength: 32,
        required: true
    },
    position: {
        type: String,
        default: 'gardenist'
    },
    photo: {
        type: String
    }
}, {timestamps: true});


module.exports = model('Stuff', stuffSchema);