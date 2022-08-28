import {Routes, Route} from "react-router-dom";
import Login from "./components/auth/login/login";
import SignUp from "./components/auth/sigup/signup";

function App() {
  return (  
      <Routes>
        <Route path="/" element = {<Login/>}/>
        <Route path="signup" element = {<SignUp/>} />
      </Routes>
  );
}

export default App;
