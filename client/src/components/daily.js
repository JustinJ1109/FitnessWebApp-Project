
import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router";
import {useParams} from 'react-router-dom';

function thisDateFormatted(date) {
    return `${date.slice(4,6)}/${date.slice(6)}/${date.slice(2,4)}`
}

export default function Daily() {

    const { date } = useParams();
    const [record, setRecord] = useState();

    const [existing, setExisting] = useState(-1);

    const navigate = useNavigate();

    useEffect(() => {
        async function getToday() {
            const response = await fetch(`http://localhost:5000/record/${date}`);

            if (!response.ok) {
                // error
                window.alert("Something went wrong")
            }
            
            const record = await response.json();
            if (!record) {
                // window.alert(`Record not found`);
                // return;
                setExisting(0)
            }
            else {
                setExisting(1)
            }
            setRecord(record);
        }

        getToday();
    },[])

    const goBack = () => {
        navigate("/");
    }


    if (existing === 1 || existing === 0) {
        if (existing === 1) {
            return (
                <div>
                    <h3>{thisDateFormatted(date)}</h3>
                    <input
                    className="btn btn-dark"
                    type="button"
                    value="Back"
                    onClick={goBack}
                    />
                </div>
            )
        }
        return (
            <div>
                <h3>{thisDateFormatted(date)}</h3>
                <div>I dont exist</div>
                <input
                className="btn btn-dark"
                type="button"
                value="Back"
                onClick={goBack}
                />
            </div>
        )
        
    }
    

    // pre-load
    return (
        <div></div>
    )
}