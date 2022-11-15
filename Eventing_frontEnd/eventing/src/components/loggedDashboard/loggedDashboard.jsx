
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
import { useDispatch } from 'react-redux';
import { loggUser } from '../../Redux/resolvers/userResolver';
import { useNavigate } from 'react-router-dom';
import {Error_STATUS} from "../constants/constants";

const LoggedDashboard = () => {
  
  const modalRef = useRef(null);
  const cardModal = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [bookedEvents , setBookedEvents] = useState([]);
  const [clickedEvent , setClickedEvent] = useState({eventInfo : null});
  const dispatching = useDispatch();
  const navigate = useNavigate();

  const addEvent = (eventObj) => {
    if (eventObj && eventObj.price && eventObj.date && eventObj.desc && eventObj.title && eventObj.creator) {
      setEvents([...events, eventObj]);
    }
  }

  useEffect(() => {
    let user = store.getState().user;
    if (user) {
      setCurrentUser(user);
    }
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
            }else{
              if(resp && resp.data && resp.data.errors && resp.data.errors[0].message &&
                (resp.data.errors[0].message === Error_STATUS.SESSION_TIMEOUT
                  || resp.data.errors[0].message === Error_STATUS.UNAUTHENTICATED)){
                  dispatching(loggUser(null));
                  navigate("/");
                }
            }
         }).catch((error)=>{
          if(error && error.response && error.response.data && error.response.data.errors && error.response.data.errors[0].message &&
            (error.response.data.errors[0].message === Error_STATUS.SESSION_TIMEOUT
            || error.response.data.errors[0].message === Error_STATUS.UNAUTHENTICATED)){
                dispatching(loggUser(null));
                navigate("/");
            }
         })
      }
  }

  const openModal = async (event) =>{
    if(cardModal && cardModal.current && event){
        await setClickedEvent(prevValue => ({...prevValue, eventInfo : event}));
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
        if(response && response.data && response.data.errors && response.data.errors[0].message &&
          (response.data.errors[0].message === Error_STATUS.SESSION_TIMEOUT
            || response.data.errors[0].message === Error_STATUS.UNAUTHENTICATED)){
            dispatching(loggUser(null));
            navigate("/");
          }
        setEvents(response.data.data.events);
      } catch (error) {
        if(error && error.response && error.response.data && error.response.data.errors && error.response.data.errors[0].message &&
          (error.response.data.errors[0].message === Error_STATUS.SESSION_TIMEOUT
            || error.response.data.errors[0].message === Error_STATUS.UNAUTHENTICATED)){
              dispatching(loggUser(null));
              navigate("/");
          }
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
          {events && events.length > 0 ? events.map((event, i) => {
            return (<>
              <EventCards event={event} key={i} currentUser={currentUser} openModal = {(e) => openModal(e)}/>
            </>);
          }) : null}
        <CardDetaialsModal ref={cardModal} currentUser={currentUser} bookedEvents = {bookedEvents} event={clickedEvent.eventInfo}
          triggerBookingFetch = {(e) => updateBookedEvents(e)}/>
        </div>
      </div>
    </div>
  );
}

export default LoggedDashboard;