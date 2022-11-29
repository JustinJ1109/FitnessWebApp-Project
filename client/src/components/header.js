import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../views/css/main.css";

export default function Header() {
    
    return (
        <div className="title row">
            <div className="col">
            <h1 id="home-title">Fitness App Title</h1>

            </div>
            <div className="col">
            <h2>nSuns 5/3/1 5-day</h2>
                
            </div>

            <div className="col"/>

        </div>
    )
}