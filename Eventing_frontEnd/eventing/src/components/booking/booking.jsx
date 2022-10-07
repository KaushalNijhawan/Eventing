import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import store from "../../Redux/state";
import Navbar from "../loggedDashboard/navbar";
import "./booking.css";
const BookingList = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [bookedEvents, setBookedEvents] = useState(null);

    useEffect(() => {
        if (store && store.getState() && store.getState().user) {
            setCurrentUser(store.getState().user);
        }
        if (currentUser && currentUser.bookingIds) {
            getCorrespondingEvents(currentUser.bookingIds);
        }
    }, [currentUser]);

    const handleCancelClick = () => {

    }

    const getCorrespondingEvents = (bookingList) => {
        if (bookingList) {
            let eventsBooked = [];
            const headers = {
                'Content-type': 'application/json',
                'authorization': 'Bearer ' + currentUser.userToken
            }
            console.log(currentUser)
            console.log(bookingList);
            const requestBody = {
                query: `
                    mutation{
                        fetchBookingRelatedEvents(bookingList:"${bookingList}"){
                          eventList{
                            _id,
                            eventName,
                            date,
                            description,
                            price
                          }
                        }
                      }
                    `
            }
            axios({
                headers: headers,
                url: 'http://localhost:3000/api',
                data: JSON.stringify(requestBody),
                method: "POST"
            }).then((res) => {
                if (res.data && res.data.data && res.data.data.fetchBookingRelatedEvents && res.data.data.fetchBookingRelatedEvents.eventList
                ) {
                    setBookedEvents(res.data.data.fetchBookingRelatedEvents.eventList);
                    console.log(bookedEvents)
                }
            }).catch((err) => {
                console.log(err);
            })
        }
    }
    return (
        <div className="parent-div">
            <Navbar currentUser={currentUser ? currentUser : null} />i
            <div className="header-text">
                <h2>Booking Lists</h2>
            </div>
            <div className="book-list">
                {currentUser && bookedEvents ? bookedEvents.map((book) => {
                    return (
                        <div key = {book._id} style={{ backgroundColor: 'white', width: '60%', marginLeft: '5%', display: 'flex', justifyContent: 'space-between' , borderRadius:'8px', height:'100%', alignItems:'center'}}>
                            <div style={{ width: '50%', fontSize: '30px' }}>{book.eventName + " - " + book.date}</div>
                            <div style={{marginTop:'4px'}}><button className="btn btn-danger">Cancel</button></div>
                        </div>
                    )
                }) : null}
            </div>
        </div>
    );
}

export default BookingList;