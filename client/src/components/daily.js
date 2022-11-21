
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {useParams} from 'react-router-dom';

export default function Daily() {

    const { id } = useParams();
    const [daily, setDaily] = useState();
    const navigate = useNavigate();

    useEffect(() => {
        async function getToday() {
            const response = await fetch(`http://localhost:5000/today/${id}`);
        }

        
    })

    const goBack = () => {
        navigate("/");
    }

    return (
        <div style={{color:"white"}}>
            <h4>Viewing ID: 
                <span>{id}</span>
            </h4>

            <input 
                type="button"
                className="btn btn-dark"
                value="Back"
                onClick={goBack}
                />
        </div>
        
    )
}