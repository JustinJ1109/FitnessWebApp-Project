import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import "../views/css/main.css";

const DayReport = (props) => (
    <div
        className="col-md day-report"
        onClick={props.gotoRecord}
        style={{ cursor: "pointer" }}
    >
        <div className="date">date</div>
        <div className="day">push Day</div>
        <div className="status">
            completed
        </div>
    </div>
);

export default function WorkoutCalendar() {
    const [records, setRecords] = useState([]);
    const navigate = useNavigate();

    // This method fetches the records from the database.
    useEffect(() => {
        async function getRecords() {
            const response = await fetch(`http://localhost:5000/record?start=2022-11-01&end=2022-11-08`);

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const records = await response.json();
            setRecords(records);
        }

        getRecords();

        return;
    }, [records.length]);

    function weekReport(week) {
        let week_records = records.map((record) => {
            return (
                <DayReport
                    record={record}
                    gotoRecord={() => {navigate(`/record/${record._id}`)}}
                    key={record._id}
                />
            );
        });

        if (week_records.length == 0) {
            return (<div>No Results for this week</div>);
        }
        return week_records;
    }

    function onClickCreate() {
        navigate("/record/create")
    }

    // This following section will display the table with the records of individuals.
    return (
        <div className="container-fluid week-report">
            <input
                type="button"
                className="btn btn-dark"
                value="Add New Entry"
                onClick={onClickCreate}
            />

            <h2>This Week</h2>
            <div className="row">
                {weekReport(0)}
            </div>
        </div>
    );
}
