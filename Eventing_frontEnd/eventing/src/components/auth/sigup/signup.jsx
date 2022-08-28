import { useState } from "react";
import "./signup.css";
import axios from "axios";

const SignUp = () =>{
    const [userObj , setUserObj] = useState({
        username : "",
        email :"",
        password:""
    });

    const [error , setError] = useState("");
    
    const handleChange = (e) =>{
        if(e && e.target){
            const value = e.target.value;
            const name = e.target.name;

            setUserObj({...userObj , [name] : value});
        }
    }

    const handleConfirmPassword = (e) =>{
        console.log(e.target.value);
    }

    const handleSubmit =(e)=>{
        e.preventDefault();
    }

    return (
        <div style={{height:"100%",width:"100%", display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}} className="home">
        <div style={{width:'30%'}}>
        <h1>Eventing SignUp</h1>
        </div>
        <div style={{width:'30%', marginTop:'2%'}}>
        <form onSubmit={e => handleSubmit(e)}>
            <div className="form-group" style={{marginTop:'3%'}}>
                <label htmlFor="exampleInputEmail1" >Username</label>
                <input type="text" className="form-control" name = "username" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Username..." 
                onChange = {e => handleChange(e)}/>
            </div>
            <div className="form-group" style={{marginTop:'3%'}}>
                <label htmlFor="exampleInputEmail1" >Email</label>
                <input type="text" className="form-control" name = "email" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Email..." 
                onChange = {e => handleChange(e)}/>
            </div>
            <div className="form-group" style={{marginTop:'3%'}}>
                <label htmlFor="exampleInputPassword1">Password</label>
                <input type="password" name = "password" className="form-control" id="exampleInputPassword1" placeholder="Enter Password..." 
                onChange = {e => handleChange(e)}/>
            </div>
            <div className="form-group" style={{marginTop:'3%'}}>
                <label htmlFor="exampleInputPassword1">Confirm Password</label>
                <input type="password" name = "cpassword" className="form-control" id="exampleInputPassword1" placeholder="Enter Confirm Password..." 
                onChange = {e => handleConfirmPassword(e)}/>
            </div>
            <button type="submit" className="btn btn-primary" style={{marginTop:'7%'}}>SignUp</button>
            <button type="submit" className="btn btn-primary" style={{marginTop:'7%',marginLeft:'2%'}} disabled = "true">Login</button>
        </form>
        </div>
    </div>
    )
}

export default SignUp;