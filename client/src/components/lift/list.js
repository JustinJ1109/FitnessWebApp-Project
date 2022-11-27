import React from "react";
import { useEffect, useState } from "react";


export default function GetLifts() {

    const [records, setRecords] = useState([]);

    useEffect(() => {
        async function getLifts() {
            const response = await fetch(`http://localhost:5000/lift_library/`);
            if (!response.ok) {
                return;
            }
        
            const records = await response.json();
    
            setRecords(records)
            console.log(records)
        }

        getLifts();

        return;
        
    }, [records.length])
    
    return (
        <div>Lifts List Page

            <div>{records.map((rec) => {
                return (
                <div
                key={rec}
                >
                    {rec.name}</div>
                )
            })}
            </div>


        </div>

    )
}