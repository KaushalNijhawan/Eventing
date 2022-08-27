const mongoose = require('mongoose');

const {Schema} = mongoose;

const event = new Schema({
    eventName : {
        type : String,
        require : true
    },
    price : {
        type: Number,
        require: true
    },
    description :{
        type : String,
        require : true
    },
    date :{
        type : String,
        require : true
    },
    creator:{
        ref:'User',
        type: mongoose.Types.ObjectId
    }
});

module.exports = mongoose.model('Event', event);