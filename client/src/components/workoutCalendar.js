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

            let temp_day = new Date(today);

            for (let i =0 ; i < 7; i++) {
                temp_day.setDate(temp_day.getDate() - 1)
                let temp_date = `${temp_day.getFullYear()}-${temp_day.getMonth()+1}-${temp_day.getDate()}`
                
                records.forEach((record) => {
                    if (record.date.includes(temp_date)) {
                        console.log('asdf')

                        return;
                    }
                    else {
                        // create new empty record
                        const emptyDay = {
                            date : temp_date,
                            day : "none",
                            status : "none"
                        };

                        // add new record to db
                        async function addEmpty() {
                            await fetch(`http://localhost:5000/record/add`, {
                                method:"POST",
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body : JSON.stringify(emptyDay),
                            })
                            .catch(error => {
                                window.alert(error);
                                return;
                            })

                            // get the new record from db (to include id)
                            const response = await fetch(`http://localhost:5000/record/getbydate/${temp_date}`)

                            if (!response.ok) {
                                const message = `Error has occurred: CODE 16-${response.statusText}`
                                window.alert(message)
                                return;
                            }

                            const new_record = await response.json();
                            if (!new_record) {
                                window.alert(`Record with date ${temp_date} not found`);
                                navigate("/");
                                return;
                            }

                            return new_record;
                        }
                        const new_record = addEmpty();

                        // add new record to all records
                        setRecords(records => [...records, new_record])
                    }
                })
            }
        }

        getRecords();

        return;
    }, [records.length]);

    console.log("REFRESH")

    function weekReport(week) {

        let week_template = [];

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
