const mongoose = require('mongoose');
const {Schema} = mongoose;
const userModel = new Schema({
    username :{
        type:String,
        require: true
    },
    password:{
        type:String,
        require: true
    },
    email:{
        type:String,
        require:true
    },
    eventsList:
    [{
        type : mongoose.Types.ObjectId,
        ref: 'Event'
    }]
});

module.exports = mongoose.model("User", userModel);
