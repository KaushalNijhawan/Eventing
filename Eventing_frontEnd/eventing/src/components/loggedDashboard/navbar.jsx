import "./dasboard.css";
import { Person } from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loggUser } from "../../Redux/resolvers/userResolver";
const Navbar = (props) => {
    const {currentUser} = props;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const logOutSession=()=>{
        dispatch(loggUser({
            ...currentUser,
            username :"",
            loggedIn:false,
            token:'',
            bookingids:[]
        }));

        navigate("/");
    }

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
                        <Link className="nav-link" style={{ color: 'white' }} to={props && props.currentUser && props.currentUser.username
                            ? "/logged/" + currentUser.username : ""}>Events</Link>
                    </li>
                </ul>
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                    <Link to="/logged/user/booking" style={{color:'white', textDecoration:'none'}}>Bookings</Link>
                    </li>
                </ul>
            </div>
            <div className="navEnd-text">
                <span>{props.currentUser && props.currentUser.username ? props.currentUser.username : ''}<Person /></span>
                <a className="navbar-brand" href="#" style={{ color: 'white' }} onClick = {()=> logOutSession()}>Logout</a>
            </div>
        </nav>
    );
}

export default Navbar;