import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { forwardRef, useEffect, useImperativeHandle } from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { useState } from 'react';
import "./cardModal.css";
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addBookingIds, loggUser } from '../../Redux/resolvers/userResolver';
import store from '../../Redux/state';
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '40%',
  height: '40%',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const CardDetaialsModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [event, setCurrentEventObj] = useState(null);
  const [buttonDisable , setButtonDisable] = useState(false);

  useEffect(()=>{
    setCurrentEventObj(props.event);
  },[props.event]);
  const dispatch = useDispatch();

  useImperativeHandle(ref, () => ({
    handleOpen() {
      setOpen(true);
    },
    handleClose() {
      setOpen(false);
    },
    checkDisable(){
      disableButtonOrNot();
    }
  }));

  const initiateBooking = () => {
    const headers = {
      'Content-Type': 'application/json',
      'authorization': 'bearer ' + props.currentUser.token
    }
    const requestBody = {
      query:
        `mutation{
          createBooking(eventID:"${event._id}"){
            _id,
            createdAt,
            updatedAt
          }
        }`
    };
    axios({
      url: 'http://localhost:3000/api',
      headers: headers, 
      method: 'POST',
      data: JSON.stringify(requestBody)
    }).then((resp) => {
      if(resp && resp.data && resp.data.data && resp.data.data.createBooking){
        console.log(props.currentUser);
        if(props.currentUser){
          dispatch(addBookingIds({
              bookingIds : [resp.data.data.createBooking._id]
            }));
        }
        let bookingIdInStore = store.getState().bookingIds;
        if(bookingIdInStore && bookingIdInStore.length > 0 ){
            props.triggerBookingFetch(bookingIdInStore);
            setOpen(false);
        }
      }
    }).catch((err) => {
      console.log(err);
    })

  }

  const disableButtonOrNot = () =>{
    console.log(props);
    console.log(event);
    if(props && event && props.bookedEvents && props.bookedEvents.length > 0){
      props.bookedEvents.map((eve)=>{
          if(eve && eve._id && event._id){
              if(eve._id === event._id){
                console.log('here');
                setButtonDisable(true);
              }
          }
        });
    }else{  
      setButtonDisable(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="headerCard">
          <div className="cardHeader">
            <h3>{event && event.eventName ? event.eventName : ''}</h3>
          </div>
          <div className="bodyCard">
            <div className="heading">
              <span style={{ fontSize: '30px' }}><DescriptionIcon /></span>
              <span className="text-card">{event && event.desc ? event.desc.toString().toUpperCase() : event && event.description ? event.description.toString().toUpperCase() : ""}</span>
            </div>
            <div>
              <span style={{ fontSize: '30px' }}><DateRangeIcon /></span>
              <span className="text-card">{event && event.date ? event.date.toString().toUpperCase() : ''}</span>
            </div>
            <div>
              <span style={{ fontSize: '30px' }}><AttachMoneyIcon /></span>
              <span className="text-card">{event && event.price ? event.price.toString().toUpperCase() : ''}</span>
            </div>
          </div>
          {props && props.currentUser && props.currentUser.username && event && event.creator && event.creator.username
            && event.creator.username == props.currentUser.username ?
            <div className="button-class">
              <button className="btn btn-dark" disabled={true}>You are the Creator</button>
              <button className="btn btn-danger" onClick={() => setOpen(false)}>Cancel</button>
            </div>
            : <div className="button-class">
              <button className="btn btn-dark" onClick={initiateBooking} disabled ={buttonDisable}>Book</button>
              <button className="btn btn-danger" onClick={() => setOpen(false)}>Cancel</button>
            </div>
          }
        </div>
      </Box>
    </Modal>
  );
})


export default CardDetaialsModal;