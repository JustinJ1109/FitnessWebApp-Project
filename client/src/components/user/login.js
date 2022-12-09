import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";


export default function UserLogin(props) {

    const navigate = useNavigate()
    const [form, setForm] = useState({
        username:'',
        password:''
    })
    const [message, setMessage] = useState('')

    function onSubmit(e) {
        e.preventDefault();
        console.log("Submitting")

        const newForm = {...form}

        fetch(`http://localhost:5000/user/authenticate-login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(newForm)
        })
        .then((res) => {
            res.json().then((body) => {
                if (body.succeeded) {
                    setMessage('')
                    navigate(body.redirectURL)
                }
                else {
                    setMessage(body.message)
                }
            })
        })
        .catch((err) => {
            console.log("**Error: " + err)
            return
        })

        setForm({username:'', password:''})
    
    }

    function updateForm(value) {
        return setForm((prev) => {
            return {...prev, ...value};
        })
    }

    return (
        <div className="container-fluid login-page page-content">
            Login
            <div style={{color:'red'}}>{message}</div>
            <div class="row">
                <form onSubmit={onSubmit}>
                    <div className="form-group col-4" >
                        <label htmlFor="username">Username</label>
                        <input 
                        type="text"
                        className="form-control"
                        id="username-text-field"
                        value={form.username}
                        onChange={(e) => updateForm({username: e.target.value})}
                        />
                    </div>

                    <div className="form-group col-4" >
                        <label htmlFor="password">Password</label>
                        <input 
                        type="password"
                        className="form-control"
                        id="password-text-field"
                        value={form.password}
                        onChange={(e) => updateForm({password: e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <input 
                        type="submit"
                        className="btn btn-dark btn-login"
                        value="Log in"
                        />
                    </div>
                </form>
            </div>
        </div>
    )
}