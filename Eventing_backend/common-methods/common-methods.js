const userModel = require('../models/userModel');
const eventModel = require('../models/eventModel');

const userById = async(userId)=>{
    try{
        const user =  await userModel.findOne({_id:{$in : userId}});
        return user;
    }catch(err){
        throw "Event with given ID Not Found!";
    }
    return null;
}

const eventById = async (eventIds)=>{
    try{
        if(eventIds && eventIds.length > 0){
            let events = []
            let i = 0;
            for(i;i<eventIds.length;i++){
                let event = await eventModel.findById(eventIds[i]);
                events.push(event);
            }
            return events;
        }
    }catch(err){
        throw "Event with given Id Not Found!";
    }
    return null;
}

module.exports = {userById, eventById};