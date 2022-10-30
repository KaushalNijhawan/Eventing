
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import store from '../../Redux/state/index';
import "./dasboard.css";
import EventModal from '../EventModal/eventModal';
import { useRef } from 'react';
import Navbar from './navbar';
import EventCards from './EventCards';
import axios from 'axios';
import CardDetaialsModal from '../CardDetailsModal/cardDetailsModal';

const LoggedDashboard = () => {

  const modalRef = useRef(null);
  const cardModal = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [bookedEvents , setBookedEvents] = useState([]);


  const addEvent = (eventObj) => {
    if (eventObj && eventObj.price && eventObj.date && eventObj.desc && eventObj.title && eventObj.creator) {
      setEvents([...events, eventObj]);
    }
  }

  useEffect(() => {
    if (store.getState().user) {
      setCurrentUser(store.getState().user);
    }
    console.log(currentUser);
    if (currentUser) {
      getEvents();
    }

    if (store && store.getState() && store.getState().eventInfo) {
      setEvents(store.getState().eventInfo);
    }
    if(currentUser && currentUser.bookingIds){
      updateBookedEvents(currentUser.bookingIds);
    }

  },[currentUser]);

  const updateBookedEvents = (bookingIds) =>{
      if(bookingIds && bookingIds.length){
        console.log(currentUser);
         const headers = {
          'Content-type': 'application/json',
          'authorization': 'Bearer ' + currentUser.token
         }
         const requestBody = {
          query: `
              mutation{
                  fetchBookingRelatedEvents(bookingList:"${bookingIds}"){
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
      };

         axios({
          url:"http://localhost:3000/api",
          method:'POST',
          headers:headers,
          data :JSON.stringify(requestBody) 
         }).then((resp) =>{
            if(resp && resp.data && resp.data.data && resp.data.data.fetchBookingRelatedEvents && resp.data.data.fetchBookingRelatedEvents.eventList){
                setBookedEvents(resp.data.data.fetchBookingRelatedEvents.eventList);
            }
         }).catch((err)=>{
          console.log(err);
         })
      }
  }

  const openModal = () =>{
    if(cardModal && cardModal.current){
      cardModal.current.handleOpen();
      cardModal.current.checkDisable();
    }
  }

  const getEvents = async () => {
    if (currentUser) {
      let userToken = currentUser.token ? currentUser.token : '';
      const headers = {
        'Content-type': 'application/json',
        'authorization': 'Bearer ' + userToken
      }
      const requestBody = {
        query: `query{
          events{ 
            creator{
              username
            },
            eventName,
            date,
             description,
            price,
            _id
          }
        }`
      }

      try {
        let response = await axios({
          method: "POST",
          url: 'http://localhost:3000/api',
          data: JSON.stringify(requestBody),
          headers: headers
        });
        setEvents(response.data.data.events);
      } catch (err) {
        console.log(err);
      }
    }
  }

  const handleEventClick = () => {
    modalRef.current.handleError();
    modalRef.current.handleOpen();
  }

  return (
    <div className="parent-div">
      <Navbar currentUser={currentUser ? currentUser : null} />
      <div className="parent-box">
        <div className="box">
          <h2 style={{ color: 'white' }}>Share Your Events</h2>
          <div className="modal-button">
            <Button variant="contained" onClick={handleEventClick}>Create Event</Button>
          </div>
        </div>
        <EventModal ref={modalRef} currentUser={currentUser} addEvent={(event) => addEvent(event)} />
        <div className="cards-div">
          {events ? events.map((event, key) => {
            return (<>
              <EventCards event={event} key={event.title} currentUser={currentUser} openModal = {openModal}/>
              <CardDetaialsModal key={key+10} ref={cardModal} currentUser={currentUser} bookedEvents = {bookedEvents} event={event}
              triggerBookingFetch = {(e) => updateBookedEvents(e)}/>
            </>);
          }) : null}
        </div>
      </div>
    </div>
  );
}

export default LoggedDashboard;