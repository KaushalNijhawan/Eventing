import { useEffect } from "react";
import "./eventCards.css";
const EventCards = ({event}) => {
    return (
        <div style={{width:'25%', backgroundColor:'white', marginLeft:'1%'}} className="shadow-lg p-3 mb-5 bg-white rounded">
            <div className="card-body">
                <h5 className="card-title">{event.eventName}</h5>
               <span className="card-b"><p className="card-text">${event.price}</p> - <p className="card-text">{event.date}</p></span>
                <a href="#" className="btn btn-primary">Show Details</a>
            </div>
        </div>
    );

}

export default EventCards;
