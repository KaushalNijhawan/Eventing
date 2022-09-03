import { useEffect, useState } from "react";
import {Routes, Route,Navigate, useNavigate} from "react-router-dom";
import Login from "./components/auth/login/login";
import SignUp from "./components/auth/sigup/signup";
import LoggedDashboard from "./components/loggedDashboard/loggedDashboard";
import store from "./Redux/state/index";
function App() {
  const [currentUser , setCurrentUser] = useState(null);
  const navigate = useNavigate();
  useEffect(()=>{
    let user = store.getState().user;
    console.log(user);
    if(user && user.username){
      setCurrentUser(user);
      navigate("/logged/"+currentUser.username);
    }else{
      navigate("/");
    }
  },[]);
  return (  
      <Routes>
        <Route path="/" element = {<Login/>}/>
        <Route path="signup" element = {<SignUp/>} />
        <Route path="*" element={<Navigate to="/" replace/>}/>
        <Route path ="/logged/:user" element ={<LoggedDashboard/>}/>
      </Routes>
  );
}

export default App;
