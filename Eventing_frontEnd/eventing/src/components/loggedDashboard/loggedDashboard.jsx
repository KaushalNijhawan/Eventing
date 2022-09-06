
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import store from '../../Redux/state/index';
import "./dasboard.css";
import EventModal from '../EventModal/eventModal';
import { useRef } from 'react';
import Navbar from './navbar';
import EventCards from './EventCards';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addEvents } from '../../Redux/resolvers/userResolver';

const LoggedDashboard = () => {

  const modalRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents ] =  useState([]);
  

  const addEvent = (eventObj) =>{
    console.log(eventObj);
    if(eventObj && eventObj.price && eventObj.date && eventObj.desc && eventObj.title && eventObj.creator){
       setEvents([...events , eventObj]);
    }
  }

  useEffect(() => {
    if (store.getState().user) {
      setCurrentUser(store.getState().user);
    }
    
    if(currentUser){
      getEvents();
    }
    
    if(store && store.getState() && store.getState().eventInfo){
      setEvents(store.getState().eventInfo);
    }
  },[currentUser]);


  const getEvents = async () =>{
    if(currentUser){
      let userToken = currentUser.token ? currentUser.token : '';
      const headers = {
        'Content-type': 'application/json',
        'authorization': 'Bearer ' + userToken
      }
      const requestBody = {
        query :`query{
          events{ 
            creator{
              username
            },
            eventName,
            date,
             description,
            price,
          }
        }`
      }

      try{
        let response =  await axios({
          method:"POST",
          url:'http://localhost:3000/api',
          data:JSON.stringify(requestBody),
          headers : headers
        });
        setEvents(response.data.data.events);
      }catch(err){
        console.log(err);
      }
      console.log(events);
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
        <EventModal ref={modalRef} currentUser={currentUser} addEvent = {(event) => addEvent(event)}/>
        <div className="cards-div">
          {events ? events.map((event, key)=>{
              return <EventCards event = {event} key={key}/>
          }) : null}
        </div>
      </div>
    </div>
  );
}

export default LoggedDashboard;