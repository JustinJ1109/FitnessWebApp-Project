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

    let weekly_data = []
    const [records, setRecords] = useState([]);
    const navigate = useNavigate();

    

    // fetches the records from the database.
    function PopulateWeek() {

        let today = new Date()
        let first = today.getDate() - today.getDay()
        let first_day = new Date(today.setDate(first))        

        let dates = []

        const week = [0,1,2,3,4,5,6]
        week.map((i) => {

            let next_day = new Date(first_day.setDate(first + i))
            let date_format = `${next_day.getFullYear()}-${next_day.getMonth() + 1}-${next_day.getDate()}`;
            dates.push(date_format)
        })

        dates.map(async (d) => {
            // console.log(`d:${d}`)

            const newDay = {
                date: d,
                day: 'none',
                status: 'none'
            }

            await fetch(`http://localhost:5000/record/add`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(newDay),
            })
            .catch(error => {
                window.alert(error);
                return;
            });            
        })
    }

    PopulateWeek();

    useEffect(() => {
        async function getRecords() {
            let today = new Date()

            // get first of week (Sun)
            let first = today.getDate() - today.getDay()
            let first_day = new Date(today.setDate(first))
            
            // get last of week (Sat)
            let last = first + 6
            let last_day = new Date(today.setDate(last))
            
            //formatted, YYYY-MM-DD str
            let first_date = `${first_day.getFullYear()}-${first_day.getMonth() + 1}-${first_day.getDate()}`;
            let last_date = `${last_day.getFullYear()}-${last_day.getMonth() + 1}-${last_day.getDate()}`;
    
            // console.log("f" + first_date)
            // console.log("l" + last_date)

            const response = await fetch(`http://localhost:5000/record?start=${first_date}&end=${last_date}`)
    
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }
            const records = await response.json();
            if (!records) {
                window.alert(`Record not found`);
                return;
            }
            setRecords(records);
            console.log("RECORDS")
            console.log(records)
        }
    
        getRecords()
    
        return;
    }, [records.length])

    


    function weekReport(week) {

        // console.log(records)
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
