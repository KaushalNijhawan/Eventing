import Modal from '@mui/material/Modal';
import { useEffect, useImperativeHandle, useState } from 'react';
import Box from '@mui/material/Box';
import { forwardRef } from 'react';
import { useDispatch } from 'react-redux';
import "./eventModal.css";
import { addEvents } from '../../Redux/resolvers/userResolver';
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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(props);
        if (eventObj && eventObj.date && eventObj.desc && eventObj.price && eventObj.desc) {
            let currentUserToken = props && props.user && props.user.token ? props.user.token : '';
            const headers = {
                'Content-type': 'application/json',
                'authorization': 'Bearer ' + currentUserToken
            }
            const responseBody = {
                query: `
                mutation{
                    createEvent(eventType:{
                      eventName:"${eventObj.title}",
                      date:"${eventObj.date}",
                      description:"${eventObj.desc}",
                      price:${Number(eventObj.price)}
                    }){
                      creator{ 
                      username,
                        eventsList{
                            eventName,
                            description,
                            price,
                            date
                        }
                      }
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

            }).catch((err) => {
                setError("Fields Suplied are Invalid!");
            })
            console.log(props);
        } else {
            setError('All Fields are mandatory!');
        }
    }

    const handleChange = (e) => {
        if (e && e.target) {
            const name = e.target.name;
            const value = e.target.value;
            setEventObj({ ...eventObj, [name]: value });
        }
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
                                onClick={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="price-event" className="labels">Price:</label>
                            <input type="text" className="form-control" id="price-event" name="title" style={{ width: '70%' }}
                                onClick={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="date-event" className="labels">Date:</label>
                            <input type="datetimelocal" id="date-event" className="form-control" name="date" style={{ width: '70%' }}
                                onClick={(e) => handleChange(e)} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="desc-event" className="labels">Description</label>
                            <textarea className="form-control" id="desc-event" name="desc" rows="3" style={{ width: '70%' }}
                                onClick={(e) => handleChange(e)} />
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