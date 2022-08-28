import { useState } from 'react';
import './login.css';

const Login = () => {
    const [loginUser , setLoginUser] = useState({
        username : "",
        password : ""
    });

    const handleChange =(e)=>{
        if(e && e.target.value){
            const name = e.target.name;
            const value = e.target.value;
            // here if you see squre brackets this will do the dynamic mapping of the fields using one way binding like it will see the name of field and assign the value to it dynamically accordingly;
            setLoginUser({...loginUser, [name] : value});
            console.log(loginUser)
        }
    }

    const handleSubmit = (e)=>{
        e.preventDefault();
    }

    return (
        <div style={{height:"100%",width:"100%", display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}} className="home">
            <div style={{width:'30%'}}>
            <h1>Eventing Login</h1>
            </div>
            <div style={{width:'30%', marginTop:'2%'}}>
            <form onSubmit={e => handleSubmit(e)}>
                <div className="form-group" style={{marginTop:'3%'}}>
                    <label htmlFor="exampleInputEmail1" >Username</label>
                    <input type="text" className="form-control" name = "username" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Username..." 
                    onChange = {e => handleChange(e)}/>
                </div>
                <div className="form-group" style={{marginTop:'3%'}}>
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input type="password" name = "password" className="form-control" id="exampleInputPassword1" placeholder="Password..." 
                    onChange = {e => handleChange(e)}/>
                </div>
                <button type="submit" className="btn btn-primary" style={{marginTop:'7%'}}>Login</button>
            </form>
            </div>
        </div>
    );
}

export default Login;