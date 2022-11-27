import React, { useEffect, useState } from "react";
import { getDropdownMenuPlacement } from "react-bootstrap/esm/DropdownMenu";
import { useNavigate } from "react-router";

import "../views/css/main.css";

const CALENDAR_FORMAT = 'col-lg col-md-4 col-sm-6 day-report clickable'

/* Single day as clickable box in calendar */
const DayReport = (props) => (
    <div
        className={props.record.date === getTodayFormatted() ? `${CALENDAR_FORMAT} today` : `${CALENDAR_FORMAT}`}
        onClick={props.gotoRecord}
    >
        <div className="date">{formatDate(props.record.date)}</div>
        <div className="day">{props.record.day != 'none' ? props.record.day + ' Day' : ''}</div>
        <div className="status">
            {props.record.status === 'none' ? '' : 'Progress: ' + props.record.status}
        </div>
    </div>
);

const DayReportPlaceholder = (props) => (
    <div
        className={`${CALENDAR_FORMAT}`}
        style={{ cursor: "pointer" }}
    >
    </div>
);

/* YYYY-MM-DD - format for MongoDB */
function getTodayFormatted() {
    let today = new Date();
    let today_actual = today.getDate()
    today = new Date(today.setDate(today_actual))
    return `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`
}

function formatDate(date_string) {
    let date = new Date(date_string)
    // why tf does this work
    date.setDate(date.getDate())

    return `${date.getMonth() + 1}/${date.getDate() + 1}`
}

Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(new Date (currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}

export default function WorkoutCalendar() {

    const [records, setRecords] = useState([]);
    const navigate = useNavigate();

    const weeks_to_display = 3;
    
    // fetches the records from the database.
    function PopulateWeek(num_weeks) {

        let dates = []
        let today = new Date()
        let first = today.getDate() - today.getDay() - (7* (num_weeks-1))

        Array.from({length : 7 + (7 * (num_weeks - 1))}).map((x , i) => {
            let next_day = new Date(today.setDate(first + i))

            let date_format = `${next_day.getFullYear()}-${next_day.getMonth() + 1}-${next_day.getDate() < 10 ? '0' + next_day.getDate() : next_day.getDate()}`;
            dates.push(date_format)
        })


        dates.map(async (d) => {
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
                // window.alert(error);
                console.log(error)
                return;
            });            
        })
    }

    // add empty records to db for dates without data
    PopulateWeek(weeks_to_display);

    useEffect(() => {
        async function getRecords() {

            let tmp_date = new Date()
            let first = tmp_date.getDate() - tmp_date.getDay() - (7 * (weeks_to_display - 1))
            let first_day = new Date(tmp_date.setDate(first))

            // get last of week (Sat)
            let last = first + 6 + (7 * (weeks_to_display-1))
            let last_day = new Date(tmp_date.setDate(last))
            
            //formatted, YYYY-MM-DD str
            let first_date = `${first_day.getFullYear()}-${first_day.getMonth()+1}-${first_day.getDate()}`;
            let last_date = `${last_day.getFullYear()}-${last_day.getMonth()+1}-${last_day.getDate()}`;
    
            console.log("f " + first_date)
            console.log("l " + last_date)

            const response = await fetch(`http://localhost:5000/record?start=${first_date}&end=${last_date}`)
    
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`;
                // window.alert(message);
                console.log(message)
                return;
            }
            const records = await response.json();
            if (!records) {
                window.alert(`Record not found`);
                return;
            }
            setRecords(records);
        }
    
        getRecords()
    
        return;
    }, [records.length])

    function weekReport(week) {

        // console.log(records)
        let week_records = records.slice(week * 7, week*7 + 7).map((record) => {
            return (
                <DayReport
                    record={record}
                    gotoRecord={() => {navigate(`/record/${record._id}`)}}
                    key={record._id}
                />
            );
        });

        if (week_records.length === 0) {
            const emptyDay = {
                date:'',
                day : '',
                status : ''
            }
            Array.from(week * 7).map((sqr) => {
                return (
                    <DayReportPlaceholder />
    
                );
            })

            
        }
        return week_records;
    }

    function onClickCreate() {
        navigate("/record/create")
    }

    // This following section will display the table with the records of individuals.
    return (
        <div className="container-fluid week-report">
            {/* <input
                type="button"
                className="btn btn-dark"
                value="Add New Entry"
                onClick={onClickCreate}
            /> */}

            <h2>This Week</h2>
            <div className="row">
                {weekReport(2)}
            </div>

            <h2>Last Week</h2>
            <div className="row">
                {weekReport(1)}
            </div>

            <h2>Week of Date</h2>
            <div className="row">
                {weekReport(0)}
            </div>
        </div>
    );
}
