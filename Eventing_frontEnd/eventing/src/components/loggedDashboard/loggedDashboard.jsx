
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import store from '../../Redux/state/index';
import "./dasboard.css";
import EventModal from '../EventModal/eventModal';
import { useRef } from 'react';
import Navbar from './navbar';
import EventCards from './EventCards';

const LoggedDashboard = () => {

  const modalRef = useRef(null);
  const [currentUser, setCurrentUser] = useState('');
  useEffect(() => {
    if (store && store.getState() && store.getState().user) {
      setCurrentUser(store.getState().user);

    }
  }, []);

  const handleEventClick = () => {
    modalRef.current.handleError();
    modalRef.current.handleOpen();
  }

  return (
    <div className="parent-div">
      <Navbar currentUser={currentUser} />
      <div className="parent-box">
        <div className="box">
          <h2 style={{ color: 'white' }}>Share Your Events</h2>
          <div className="modal-button">
            <Button variant="contained" onClick={handleEventClick}>Create Event</Button>
          </div>
        </div>
        <EventModal ref={modalRef} currentUser={currentUser} />
        <div className="cards-div">
          <EventCards />
        </div>
      </div>
    </div>
  );
}

export default LoggedDashboard;