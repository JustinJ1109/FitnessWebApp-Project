
import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router";
import {useParams} from 'react-router-dom';


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
            console.log(record)
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

    return (
        <div>
            <div className="date-title">
                <h3>{record.date}</h3>
            </div>
        </div>
    )

    if (existing === 1) {
        return (
            <div>
                <h3>I exist, show data</h3>
                <input
                className="btn btn-dark"
                type="button"
                value="Back"
                onClick={goBack}
                />
            </div>
        )
    }
    else if (existing === 0) {
        return (
            <div>
                <h3>I don't exist, let me create new</h3>
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