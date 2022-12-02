import React, { useEffect, useState } from "react";

import "../views/css/main.css";

export default function Header(props) {

    const [programTitle, setProgramTitle] = useState();

    useEffect(() => {

        async function getProgram() {
            
            const response = await fetch(`http://localhost:5000/user`)
            if (!response.ok) {
                // user not found, no login?
                console.log("Could not fetch")
                return;
            }

            response.json()
            .then((b) => {
                setProgramTitle(b[0].program);

            })
        }
        getProgram();
    }, [])
    
    return (
        <div className="title row">
            <div className="col-4 col-md-3 col-sm-6 col-4">
            <h1 id="home-title"><a href="/">App Title</a></h1>

            </div>
            <div className="col-lg-4 col-md-3 col-6">
            <h2>{programTitle}</h2>
                
            </div>
            {props.username ? 
            
            <div className="col-lg-4 col-md-3 col-2-sm col-6 logged-in-as">Logged in as 
            <span className="user-name"><a className="user-profile-link" href={`/user/profile`}> {`${props.username}`}</a></span></div>

            :

            <div className="col-lg-4 col-md-3 col-2-sm col-6 logged-in-as"><a className="user-login-link" href={`/user/login`}>Log in</a></div>
        
            }
            

        </div>
    )
}