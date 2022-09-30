const eventModel = require('../../models/eventModel'); 
const userModel = require('../../models/userModel');
const bcrypt = require("bcrypt");
const {eventById, userById} = require('../../common-methods/common-methods');
const bookingModel = require('../../models/bookingModel');
const jwt = require('jsonwebtoken');

const existingUser = async (username)=>{
    if(username){
        try{
            const user =  await userModel.find({username :{$in : username}});
            
            if(user.length > 0){
                return true;
            }
        }catch(err){
            return false;
        }
    }
    return false;
}

module.exports = {
    // if we want to fetch the req here than always pass args , req event if we are not passing any args from UI
    events : async(args , req)=>{
        if(!req.isAuth){
            throw new Error('unauthenticated User!');
        }
        const events = await eventModel.find();
        return events.map((event)=>{
            return {
                ...event._doc,
                creator: userById(event.creator)
            }
        });
    },
    users: async()=>{
        const users = await userModel.find();
        return await users.map(async (user)=>{
            return {
                ...user._doc,
                eventsList: await eventById(user.eventsList)
            }
        });
    },
    bookings : async(req)=>{
        if(!req.isAuth){
            throw new Error('unauthenticated User!');
        }
        const booking = await bookingModel.find();
        return booking.map((book)=>{
            return {
                ...book._doc,
                user : userModel.findOne({_id:{$in : book._doc.user}}),
                event : eventModel.findOne({_id:{$in : book._doc.event}}) 
            }
        })
    },
    createEvent : async (args, req)=>{
        if(!req.isAuth){
            throw new Error('unauthenticated User!');
        }
        let user = await userModel.findOne({username : {$in : req.userId}});  
        const custEvent = {
            _id : Math.random().toString(),
            eventName : args.eventType.eventName,
            date : new Date().toLocaleDateString(),
            description : args.eventType.description,
            price : args.eventType.price,
            creator : user && user._id ? user._id : '' 
        }
        const event = await new eventModel({
            eventName : args.eventType.eventName,
            date : args.eventType.date,
            description : args.eventType.description,
            price : args.eventType.price,
            creator : user ? user._id :  ''
        }).save();
        if(user){
            if(user['eventsList']){
                user['eventsList'].push(event);
            }else{
                user['eventsList'] = [event];
            }
                await user.save();
        }
        
        if(event){
            console.log('event saved!');
         }
        return event;
    },
    createUser : async(args)=>{
       let response = await existingUser(args.userDetails.username);
       if(!response){
            response = await userModel.find({email :{$in : args.userDetails.email}});
       }
       if(response.length > 0 ){
            throw new Error('User is Existing!');
       }else{
        const customUser = {
            username : args.userDetails.username,
            password: args.userDetails.password,
            email : args.userDetails.email,
            eventsList : null,
            bookingId : null
        };
        const salt = await bcrypt.genSalt(10);
        customUser.password = await bcrypt.hash(customUser.password, salt);
        const user = await new userModel(customUser).save();
        if(user){
            console.log('user saved!');
            return user;
        }
        return null;
       }
    },
    createBooking :async (args, req)=>{
        if(!req.isAuth){
            throw new Error('unauthenticated User!');
        }
        if(args && args.eventID){
            let event = await eventModel.findById(args.eventID);
            let user = await userModel.findOne({username:{$in : req.userId}})
            let booking = {
                event : event._id,
                user : user._id,
            }
            const custBooking = await new bookingModel(booking).save();
            let bookingId =  custBooking._doc._id;
            if(user && user.bookingIds){
                user.bookingIds.push(bookingId);
                await user.save();
                console.log('user updated');
            }
            if(custBooking){
                return {
                    ...booking,
                    createdAt :  custBooking._doc.createdAt,
                    updatedAt : custBooking._doc.updatedAt,
                    _id: custBooking._doc._id
                }
            }
            return null;
        }
    },
    cancelBooking : async (args)=>{
        if(args && args.bookingId){
            let bookingId = bookingModel.findById(args.bookingId);
            let eventId = bookingId && bookingId['event'] ? bookingId['event'] : null;
            let userId =  bookingId && bookingId['user'] ? bookingId['user'] : null;
            let user,event;
            if(userId){
                user = await userModel.findById(userId); 
                event = await eventModel.findById(eventId);
            }
            await bookingModel.deleteOne({_id : {$in : bookingId}});
            return {
                ...bookingId,
                user : user,
                event : event
            }
        }
    },
    loginUser : async ({username, password})=>{
        if(username && password){
            const user = await userModel.findOne({username : {$in : username}});      
            let passwordEncode = user && user.password ? user.password : '';
            let match = await bcrypt.compare(password, passwordEncode);
            if(match == true){
                const token = jwt.sign({ foo: username },"longlongververyverylongstringthisoneis", {expiresIn : '1h'});
                let eventList = [];
                if(user && user.eventsList){
                    await user.eventsList.map(async (eid)=>{
                        let event = await eventModel.findById(eid);
                        eventList.push(event);
                    });
                }
                console.log(user);
                return {
                    ...user,
                    username : user.username,
                    token : token,
                    eventList : eventList,
                    bookingIds : user.bookingIds
                };
            }else{
                throw new Error('Username or Password is Invalid!');
            }
        }
    },
    // always remeber here below the args comes first and the req params 
    fetchBookingRelatedEvents : async (args, req)=>{
        if(req.isAuth){
            throw new Error("User not Authenticated!")
        }
        if(args && args.bookingList){
            console.log(args.bookingList);
            let bookingIds = args.bookingList;
            let eventObjList = [];
           await bookingIds.map(async (id)=>{
                let booking = await bookingModel.findById(id);
                if(booking){
                   let eventObj = await eventModel.findById(booking.event);
                   eventObjList.push(eventObj);
                   console.log('206 - ' + eventObjList);
                }
            });
            console.log('209 - ' + eventObjList);
            return eventObjList;
        }
        return null;

    }
}