import axios from "axios";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loggUser, resetState, updateBookingIds } from "../../Redux/resolvers/userResolver";
import store from "../../Redux/state";
import Navbar from "../loggedDashboard/navbar";
import "./booking.css";
import BookingAlertPopup from "./bookingAlertPopup";
import  {Error_STATUS} from "../constants/constants";
const BookingList = () => {
    const [currentUser, setCurrentUser] = useState(null);
    const [bookedEvents, setBookedEvents] = useState(null);
    const bookingCancel = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (store && store.getState() && store.getState().user) {
            setCurrentUser(store.getState().user);
        }
        if (currentUser && currentUser.bookingIds && currentUser.bookingIds.length > 0) {
            getCorrespondingEvents(currentUser.bookingIds);
        } else if (currentUser && store.getState().bookingIds && store.getState().bookingIds.length > 0) {
            getCorrespondingEvents(store.getState().bookingIds);
        }
    }, [currentUser]);

    const handleCancelClick = (index) => {
        if (bookingCancel) {
            bookingCancel.current.handleOpen();
            setCurrentIndex(index);
        }

    }

    const cancelBooking = () => {
        if (currentIndex >= 0) {
            if (bookedEvents && bookedEvents.length > 0) {
                bookedEvents.splice(currentIndex, 1);
                setBookedEvents(bookedEvents);
            }

            let bookingId = currentUser.bookingIds[currentIndex] ? currentUser.bookingIds[currentIndex] : store.getState().bookingIds[currentIndex] ?
                store.getState().bookingIds[currentIndex] : null;
            if (bookingId) {
                const headers = {
                    'Content-type': 'application/json',
                    'authorization': 'Bearer ' + currentUser.token
                }

                const requestBody = {
                    query: `mutation CancelBoooking($id : ID!){
                        cancelBooking(bookingId:$id)
                      }`,
                      variables:{
                        id : bookingId
                      }
                };

                axios({
                    method: "POST",
                    url: "http://localhost:3000/api",
                    headers: headers,
                    data: JSON.stringify(requestBody)
                }).then((resp) => {
                    if (resp && resp.data && resp.data.data && resp.data.data.cancelBooking) {
                        let updatedIds = resp.data.data.cancelBooking;
                        dispatch(updateBookingIds({
                            bookingIds: updatedIds
                        }));
                        dispatch(loggUser({
                            ...currentUser,
                            bookingIds: updatedIds
                        }));
                        navigate("/logged/user/booking");
                    }else{
                        if(resp && resp.data && resp.data.errors && resp.data.errors[0].message &&
                          (resp.data.errors[0].message === Error_STATUS.SESSION_TIMEOUT || 
                            resp.data.errors[0].message === Error_STATUS.UNAUTHENTICATED)){
                            dispatch(resetState());
                            navigate("/");
                          }
                    }
                }).catch((error) => {
                    if (error && error.response && error.response.data && error.response.data.errors && error.response.data.errors[0].message &&
                        (error.response.data.errors[0].message === Error_STATUS.SESSION_TIMEOUT
                        || error.response.data.errors[0].message === Error_STATUS.UNAUTHENTICATED)) {
                        dispatch(resetState());
                        navigate("/");
                    }
                })
                bookingCancel.current.handleClose();
            }
        }
    }

    const getCorrespondingEvents = (bookingList) => {
        if (bookingList) {
            let eventsBooked = [];
            const headers = {
                'Content-type': 'application/json',
                'authorization': 'Bearer ' + currentUser.token
            }
            // here below i have defined variables section to indicate the graphQL that I am sending variables which is a better way of sending variables to graphQL like Array or String or any kind of Variables
            const requestBody = {
                query: `
                    mutation FetchBookingRelatedEvents($list: [String]!){
                        fetchBookingRelatedEvents(bookingList:$list){
                          eventList{
                            _id,
                            eventName,
                            date,
                            description,
                            price
                          }
                        }
                      }
                    `,
                    variables:{
                        list : bookingList
                    }
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
                }else{
                    if(res && res.data && res.data.errors && res.data.errors[0].message &&
                      (res.data.errors[0].message === Error_STATUS.SESSION_TIMEOUT || 
                        res.data.errors[0].message === Error_STATUS.UNAUTHENTICATED)){
                        dispatch(resetState());
                        navigate("/");
                      }
                  }
            }).catch((error) => {
                if (error && error.response && error.response.data && error.response.data.errors && error.response.data.errors[0].message &&
                    (error.response.data.errors[0].message === Error_STATUS.SESSION_TIMEOUT
                        || error.response.data.errors[0].message === Error_STATUS.UNAUTHENTICATED)) {
                    dispatch(resetState());
                    navigate("/");
                }
            })
        }
    }
    return (
        <div className="parent-div">
            <Navbar currentUser={currentUser ? currentUser : null} />
            <div className="header-text">
                <h2>Booking Lists</h2>
            </div>
            <div className="book-list">
                {currentUser && bookedEvents ? bookedEvents.map((book, i) => {
                    return (
                        <div key={book._id} style={{ backgroundColor: 'white', width: '60%', marginLeft: '5%',  display: 'flex', justifyContent: 'space-between', borderRadius: '8px', height: '100%', alignItems: 'center' ,
                        marginTop:'1%'}}>
                            <div style={{ width: '50%', fontSize: '30px' }}>{book.eventName + " - " + book.date}</div>
                            <div style={{ marginTop: '4px' }}><button className="btn btn-danger" onClick={() => handleCancelClick(i)}>Cancel</button></div>
                        </div>
                    )
                }) : null}
            </div>
            <div className="popup">
                <BookingAlertPopup ref={bookingCancel} cancelBooking={cancelBooking}
                />
            </div>
        </div>
    );
}

export default BookingList;