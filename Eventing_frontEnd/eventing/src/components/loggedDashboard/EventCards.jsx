import "./eventCards.css";
const EventCards = (props) => {
    const showDetails = () => {
        if (props && props.event) {
            props.openModal(props.event);
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
