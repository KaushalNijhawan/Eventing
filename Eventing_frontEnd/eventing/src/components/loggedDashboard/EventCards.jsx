import { useEffect } from "react";
import "./eventCards.css";
import Tooltip from '@mui/material/Tooltip';
const EventCards = (props) => {
    const sameUserOrNot = () => {
        if (props && props.event && props.currentUser) {
            let usernameCurrent = props.currentUser.username ? props.currentUser.username : '';
            let eventUser = props.event && props.event.creator ? props.event.creator.username : '';
            if (usernameCurrent && eventUser) {
                return usernameCurrent === eventUser;
            }
        }
        return false;
    }
    const showDetails = () => {
        if (props && props.openModal) {
            props.openModal();
        }
    }


    return (
        <div style={{ width: '25%', backgroundColor: 'white', marginLeft: '1%' }} className="shadow-lg p-3 mb-5 bg-white rounded">
            <div className="card-body">
                <h5 className="card-title">{props.event.eventName}</h5>
                <span className="card-b"><p className="card-text">${props.event.price}</p> - <p className="card-text">{props.event.date}</p></span>
                <span className="card-but">
                    <button className="btn btn-primary" onClick={showDetails}>Show Details</button>
                </span>
            </div>
        </div>
    );

}

export default EventCards;
