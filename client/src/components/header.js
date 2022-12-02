import React, { useEffect, useState } from "react";

import "../views/css/main.css";

const _USER = "Justin"

export default function Header() {

    const [programTitle, setProgramTitle] = useState();

    useEffect(() => {

        async function getProgram() {
            const response = await fetch(`http://localhost:5000/user?name=${_USER}`)
            if (!response.ok) {
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
            <div className="col">
            <h1 id="home-title"><a href="/">App Title</a></h1>

            </div>
            <div className="col">
            <h2>{programTitle}</h2>
                
            </div>

            <div className="col logged-in-as">Logged in as 
            <span className="user-name"><a className="user-profile-link" href={`/user/${_USER}`}> {`${_USER} \u25BD`}</a></span></div>

        </div>
    )
}