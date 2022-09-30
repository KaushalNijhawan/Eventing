import Modal from '@mui/material/Modal';
import { useEffect, useImperativeHandle, useState } from 'react';
import Box from '@mui/material/Box';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import "./eventModal.css";
import { addEvents, loggUser } from '../../Redux/resolvers/userResolver';
import axios from 'axios';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '40%',
    height: '50%',
    bgcolor: 'background.paper',
    border: '2px solid white',
    boxShadow: 24,
    p: 4,
};

const EventModal = forwardRef((props, ref) => {
    const [open, setOpen] = useState(false);
    const [eventObj, setEventObj] = useState({
        title: '',
        price: '',
        date: '',
        desc: ''
    });

    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const handleClose = () => { setOpen(false) }

    useImperativeHandle(ref, () => ({
        handleOpen() { setOpen(true) },
        handleClose() { setOpen(false) },
        handleError() { setError('') }
    }));

    const createBooking  = (eventId) =>{
        const headers = {
            'Content-Type': 'application/json',
            'authorization': 'bearer ' + props.currentUser.token
          }
          const requestBody = {
            query:
              `mutation{
                createBooking(eventID:"${eventId}"){
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
                dispatch(loggUser({
                  ...props.currentUser,
                  bookingIds : props.currentUser && props.currentUser.bookingIds ? props.currentUser.bookingIds.push(resp.data.data.createBooking) : 
                  [resp.data.data.createBooking]
                }));
            }
            console.log(resp);
          }).catch((err) => {
            console.log(err);
          });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (eventObj && eventObj.date && eventObj.desc && eventObj.price && eventObj.desc) {
            let date = eventObj.date.substring(0,10);
            let currentUserToken = props && props.currentUser && props.currentUser.token ? props.currentUser.token : '';
            const headers = {
                'Content-type': 'application/json',
                'authorization': 'Bearer ' + currentUserToken
            }
            const responseBody = {
                query: `
                mutation{
                    createEvent(eventType:{
                      eventName:"${eventObj.title}",
                      date:"${date}",
                      description:"${eventObj.desc}",
                      price:${Number(eventObj.price)}
                    }){
                        eventName,
                        date,
                        _id
                    }
                  }
                `
            }

            axios({
                method: 'POST',
                headers: headers,
                url: 'http://localhost:3000/api',
                data: JSON.stringify(responseBody)
            }).then((resp) => {
                console.log(resp);
                if(resp && resp.data && resp.data.data && resp.data.data.createEvent){
                    let id = resp.data.data.createEvent._id;
                    setError('');
                    let newEventObj = {
                        ...eventObj,
                        eventName : eventObj.title,
                        date : date,
                        creator:{
                            username : props.currentUser.username
                        },
                        id : id 
                    }
                    createBooking(id); 
                    dispatch(addEvents(newEventObj));
                    props.addEvent(newEventObj);
                    setOpen(false);
                }else{
                }
            }).catch((err) => {
                setError("Fields Suplied are Invalid!");
            })
        } else {
            setError('All Fields are mandatory!');
        }
    }

    const handleChange = (e) => {
        if (e && e.target) {
            const name = e.target.name;
            const value = e.target.value;
            if(name === 'price'){
                let isNumber =  Number(value);
                if(isNaN(isNumber)){
                    setError('Only Numbers Allowed in Price!');
                }else{
                    setError('');
                }
            }
            setEventObj({ ...eventObj, [name]: value });
        }
    }

    const currentDate = () =>{
        let time = new Date().getHours() + ":" + new Date().getMinutes();
        let date = new Date().toISOString().split("T")[0];
        return date + "T" + time;
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div className="event-form">
                    <h2>Event Information</h2>
                    <form>
                        <div className="form-group">
                            <label htmlFor="title-event" className="labels">Title:</label>
                            <input type="text" className="form-control" id="title-event" name="title" style={{ width: '70%' }}
                                onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="price-event" className="labels">Price:</label>
                            <input type="text" className="form-control" id="price-event" name="price" style={{ width: '70%' }}
                                onChange={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="date-event" className="labels">Date:</label>
                            <input type="datetime-local" id="date-event" className="form-control" name="date" style={{ width: '70%' }}
                                onChange={(e) => handleChange(e)} min ={currentDate()} max = "2022-12-31T00:00"/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="desc-event" className="labels">Description</label>
                            <textarea className="form-control" id="desc-event" name="desc" rows="3" style={{ width: '70%' }}
                                onChange={(e) => handleChange(e)} />
                        </div>
                        {error ? <div style={{ color: 'red', fontWeight: 'bold', alignItems: "start" }}>{error}</div> : null}
                        <div className="form-group">
                            <button className="btn btn-primary" onClick={(e) => handleSubmit(e)}
                                disabled={eventObj && eventObj.date && eventObj.desc && eventObj.price && eventObj.title
                                    ? false : true}>Add</button>
                            <button className="btn btn-danger" onClick={() => setOpen(false)}>Cancel</button>
                        </div>
                    </form>
                </div>
            </Box>
        </Modal>
    );
})

export default EventModal;