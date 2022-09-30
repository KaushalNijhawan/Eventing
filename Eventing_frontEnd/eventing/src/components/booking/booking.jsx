import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import store from "../../Redux/state";
import Navbar from "../loggedDashboard/navbar";
import "./booking.css";
const BookingList = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [bookedEvents , setBookedEvents] = useState(null); 
    
    useEffect(() => {
        if (store && store.getState() && store.getState().user) {
            setCurrentUser(store.getState().user);
        }
        if (currentUser && currentUser.bookingIds) {
            getCorrespondingEvents(currentUser.bookingIds);
        }
    }, [currentUser]);

    const getCorrespondingEvents = (bookingList)=>{
            if(bookingList){
                let eventsBooked = [];
                const headers = {
                    'Content-type' : 'application/json',
                    'authorization' : 'Bearer ' + currentUser.token
                }
                console.log(bookingList);
                const requestBody = {
                    query : `
                    mutation{
                        fetchBookingRelatedEvents(bookingList:${bookingList}){
                            _id,
                          eventName,
                          date,
                          description,
                          price
                        }
                      }
                    `
                }
                axios({
                    headers : headers,
                    url:'http://localhost:3000/api',
                    data : JSON.stringify(requestBody),
                    method:"POST"
                }).then((res)=>{
                    console.log(res);
                }).catch((err)=>{
                    console.log(err);
                })
            }
    }
    return (
        <div className="parent-div">
            <Navbar currentUser={currentUser ? currentUser : null} />i
            <div className="header-text">
                <h2>Booking Lists</h2>
                {currentUser && currentUser.booking ? currentUser.booking.map((book) => {
                    return (
                        <ul className="list-group">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                {/* {book.} */}
                                <span className="badge badge-primary badge-pill">14</span>
                            </li>
                        </ul>
                    )
                }) : null}
            </div>
        </div>
    );
}

export default BookingList;