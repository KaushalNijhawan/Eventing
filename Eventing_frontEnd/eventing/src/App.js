import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {Routes, Route,Navigate, useNavigate} from "react-router-dom";
import Login from "./components/auth/login/login";
import SignUp from "./components/auth/sigup/signup";
import BookingList from "./components/booking/booking";
import LoggedDashboard from "./components/loggedDashboard/loggedDashboard";
import { loggUser } from "./Redux/resolvers/userResolver";
import store from "./Redux/state/index";
function App() {
  const [currentUser , setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(()=>{
    checkLoginOrNot();
    let user = store.getState().user;
    if(user && (user.username || user["username"])){
      setCurrentUser(user);
      navigate("/logged/"+user.username);
    }else{
      navigate("/");
    }
  },[]);

  const checkLoginOrNot = () =>{
      if(localStorage && localStorage.getItem("user")!= null){
        let currentUser = JSON.parse(localStorage.getItem("user"));
        dispatch(loggUser(currentUser));
        navigate("/logged/" + currentUser.username);
      }
  }

  return (  
      <Routes>
        <Route path="/" element = {<Login/>}/>
        <Route path="signup" element = {<SignUp/>} />
        <Route path="*" element={<Navigate to="/" replace/>}/>
        <Route path ="/logged/:user" element ={<LoggedDashboard/>}/>
        <Route path ="/logged/user/booking" element = {<BookingList/>} />
      </Routes>
  );
}

export default App;
