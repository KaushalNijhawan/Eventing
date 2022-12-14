import { useState } from 'react';
import './login.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addBookingIds, loggUser, resetState, updateBookingIds } from '../../../Redux/resolvers/userResolver';
import {Error_STATUS} from "../../constants/constants";
const Login = () => {
    const [loginUser, setLoginUser] = useState({
        username: "",
        password: ""
    });
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState("");

    const handleChange = (e) => {
        if (e && e.target.value) {
            const name = e.target.name;
            const value = e.target.value;
            // here if you see squre brackets this will do the dynamic mapping of the fields using one way binding like it will see the name of field and assign the value to it dynamically accordingly;
            setLoginUser({ ...loginUser, [name]: value });
            setError("");
        }
    }

    const localStorageDetails=(tokenObject)=>{
    
        localStorage.setItem('user', JSON.stringify(tokenObject.userObject));
        
        setTimeout(()=>{
            localStorage.clear();
            dispatch(resetState());
            navigate("");    
        }, tokenObject.expiry*1000);
    
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loginUser) {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': 'JWT fefege...'
            }
            let requestBody = {
                query: `mutation LoginUser($username : String , $password: String ){
                    loginUser(username:$username, password:$password){
                      username,
                      token,
                      bookingIds,
                      expiresIn
                    }
                  }`,
                  variables:{
                    username : loginUser.username,
                    password : loginUser.password
                  }
            };
            axios({
                url: "http://localhost:3000/api",
                method: "POST",
                headers: headers,
                data: JSON.stringify(requestBody)
            }).then((resp) => {
                if (resp && resp.data) {
                    setError(resp.data && resp.data.errors && resp.data.errors[0].message ? resp.data.errors[0].message : "");
                    if (error == "") {
                        let responseObject = resp.data.data.loginUser;
                        if (responseObject && responseObject.token) {
                            responseObject = {
                                ...responseObject
                                ,
                                loggedIn: true
                            };
                            dispatch(loggUser(responseObject));
                            if(responseObject && responseObject.bookingIds){
                                dispatch(updateBookingIds({
                                    bookingIds :  responseObject.bookingIds
                                }));
                            }
                            
                            let tokenObject = {
                                userObject : responseObject,
                                expiry : responseObject.expiresIn               
                            }
                            localStorageDetails(tokenObject);
                            navigate("/logged/" + responseObject.username);
                        }
                    }
                }
            }).catch((error) => {
                setError("User Not Present, try Signup!");
                if (error && error.response && error.response.data && error.response.data.errors && error.response.data.errors[0].message &&
                    error.response.data.errors[0].message === Error_STATUS.SESSION_TIMEOUT) {
                    dispatch(resetState());
                    navigate("/");
                }
            })

        }
    }

    return (
        <div style={{ height: "100%", width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }} className="home">
            <div style={{ width: '30%' }}>
                <h1>Eventing Login</h1>
            </div>
            <div style={{ width: '30%', marginTop: '2%' }}>
                <form onSubmit={e => handleSubmit(e)}>
                    <div className="form-group" style={{ marginTop: '3%' }}>
                        <label htmlFor="exampleInputEmail1" >Username</label>
                        <input type="text" className="form-control" name="username" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter Username..."
                            onChange={e => handleChange(e)} />
                    </div>
                    <div className="form-group" style={{ marginTop: '3%' }}>
                        <label htmlFor="exampleInputPassword1">Password</label>
                        <input type="password" name="password" className="form-control" id="exampleInputPassword1" placeholder="Password..."
                            onChange={e => handleChange(e)} />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '7%' }}
                        disabled={error != "" ? true : false} >Login</button>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: '7%', marginLeft: '2%' }}
                        onClick={() => navigate('/signUp')}>Create User</button>
                    {error ? <div className="error">{error}</div> : null}
                </form>
            </div>
        </div>
    );
}

export default Login;