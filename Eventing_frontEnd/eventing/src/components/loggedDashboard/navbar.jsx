import "./dasboard.css";
import { Person } from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';
const Navbar = (props) => {
    return (
        <nav className="navbar fixed-top navbar-expand-lg navbar-light" style={{backgroundColor: 'rgb(15, 82, 186)'}}>
            <EventIcon className="navbar-brand" style={{ fontSize: "45px", color: 'white' }} />
            <a className="navbar-brand" href="#" style={{ color: 'white' }}>Eventing</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="#" style={{ color: 'white' }}>Events</a>
                    </li>
                </ul>
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a className="nav-link" href="#" style={{ color: 'white' }}>Bookings</a>
                    </li>
                </ul>
            </div>
            <div className="navEnd-text">
                <span>{props && props.currentUser && props.currentUser.username ? props.currentUser.username : ''}<Person /></span>
                <a className="navbar-brand" href="#" style={{ color: 'white' }}>Logout</a>
            </div>
        </nav>
    );
}

export default Navbar;