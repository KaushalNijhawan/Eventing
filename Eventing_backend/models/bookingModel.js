const mongoose = require('mongoose');
const {Schema} = mongoose;
const booking = new Schema({
    user : {
        type : mongoose.Types.ObjectId,
        ref : 'User'
    },
    event : {
        type: mongoose.Types.ObjectId,
        ref:'Event'
    }
},{timestamps : true});

module.exports = mongoose.model('Booking', booking);