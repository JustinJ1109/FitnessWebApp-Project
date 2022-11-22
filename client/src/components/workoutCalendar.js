import React, { useEffect, useState } from "react";
import { getDropdownMenuPlacement } from "react-bootstrap/esm/DropdownMenu";
import { useNavigate } from "react-router";

import "../views/css/main.css";

/* Single day as clickable box in calendar */
const DayReport = (props) => (
    <div
        className="col-md day-report"
        onClick={props.gotoRecord}
        style={{ cursor: "pointer" }}
    >
        <div className="date">{new Date(props.record.date).toLocaleDateString()}</div>
        <div className="day">{props.record.day} Day</div>
        <div className="status">
            {props.record.status === 'complete' ?? ''}
        </div>
    </div>
);

export default function WorkoutCalendar() {

    const weekly_data = []
    const [records, setRecords] = useState([]);
    const navigate = useNavigate();

    // fetches the records from the database.
    useEffect(() => {
        async function getRecords() {
            let today = new Date()
            let this_week_start = new Date(today)
            this_week_start.setDate(this_week_start.getDate() - 7)

            const response = await fetch(`http://localhost:5000/record?start=${this_week_start.toLocaleDateString()}&end=${today.toLocaleDateString()}`);

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const records = await response.json();

            console.log(records)
            setRecords(records);
        }

        getRecords();

        return;
    }, [records.length]);

    console.log("REFRESH")

    function weekReport(week) {

        let week_template = [];
        let temp_day = new Date();

            // temp_day.setDate(temp_day.getDate() - 1)

            // let temp_date = `${temp_day.getFullYear()}-${temp_day.getMonth()+1}-${temp_day.getDate()}`

            // YYYY-MM-DD
        

        let week_records = records.map((record) => {
            return (
                <DayReport
                    record={record}
                    gotoRecord={() => {navigate(`/record/${record._id}`)}}
                    key={record._id}
                />
            );
            
        });

        if (week_records.length === 0) {
            return (<div>No Results for this week</div>);
        }
        return week_records;
    }

    function onClickCreate() {
        navigate("/record/create")
    }

    function getDate() {
        let today = new Date()
        let this_week_start = new Date(today)
        this_week_start.setDate(this_week_start.getDate() - 7)

        return <div>
            {today.toLocaleDateString()}
            {this_week_start.toLocaleDateString()}
        </div>
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

            {getDate()}

            <h2>This Week</h2>
            <div className="row">
                {weekReport(0)}
            </div>
        </div>
    );
}
