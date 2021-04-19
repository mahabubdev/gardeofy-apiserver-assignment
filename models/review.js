const { model, Schema } = require('mongoose');
const uid = require('myuid');


const reviewSchema = new Schema({
    uid: {
        type: String,
        default: uid() + '-' + uid() + '-' + uid(),
    },
    description: {
        type: String,
        required: true,
        minLength: 16,
        maxLength: 255,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true
    }
}, {timestamps: true});


module.exports = model('Review', reviewSchema);