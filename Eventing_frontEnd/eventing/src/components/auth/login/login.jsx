import { useState } from 'react';
import './login.css';
import axios from "axios";
const Login = () => {
    const [loginUser , setLoginUser] = useState({
        username : "",
        password : ""
    });

    const [error , setError] = useState("");

    const handleChange =(e)=>{
        if(e && e.target.value){
            const name = e.target.name;
            const value = e.target.value;
            // here if you see squre brackets this will do the dynamic mapping of the fields using one way binding like it will see the name of field and assign the value to it dynamically accordingly;
            setLoginUser({...loginUser, [name] : value});
            console.log(loginUser)
        }
    }

    const handleSubmit = async (e)=>{
        e.preventDefault();
        if(loginUser){
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'JWT fefege...'
            }
            let requestBOdy = {
                query : `mutation{
                loginUser(username:"${loginUser.username}", password:"${loginUser.password}"){
                  username,
                  token
                }
              }`
            };
            axios({
                url:'http://localhost:3000/api',
                method:"POST",
                headers: headers,
                data:JSON.stringify(requestBOdy)
            }).then((resp)=>{
                if(resp && resp.data){
                    setError(resp.data && resp.data.errors && resp.data.errors[0].message ? resp.data.errors[0].message : "");
                    if(error == ""){
                        // no error case;
                    }
                }
            }).catch((err)=>{
                setError("User Not Present, try Signup!");
                console.log(err)
            })
            
        }
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
                <button type="submit" className="btn btn-primary" style={{marginTop:'7%'}}
                disabled = {error!="" ? true : false} >Login</button>
                <button type="submit" className="btn btn-primary" style={{marginTop:'7%',marginLeft:'2%'}} 
                disabled = {error!= "" ? false : true}>Create User</button>
                {error ? <div className = "error">{error}</div> : null}
              </form>
            </div>
        </div>
    );
}

export default Login;