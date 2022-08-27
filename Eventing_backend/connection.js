const mongoose = require('mongoose');
const process = require('./env/mongoose.json');

const db = mongoose.connect(`mongodb://localhost:27017/${process.MONGOOSE_USER}`).then(()=>{
    console.log('DB connected!');
}).catch((err)=>{
    console.log('error has occured!');
    console.log(err);
});
module.exports = db;