import React, { useEffect, useState } from "react";
import { getDropdownMenuPlacement } from "react-bootstrap/esm/DropdownMenu";
import { useNavigate } from "react-router";

import "../views/css/main.css";

const CALENDAR_FORMAT = 'col-lg col-md-4 col-sm-6 day-report clickable'

const _USER = "Justin"

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

    let d = new Date()

    d = d.addDays(-d.getDay());

    const [records, setRecords] = useState([]);
    const [user, setUser] = useState();
    const [dateMap, setDateMap] = useState([])
    const navigate = useNavigate();

    const weeks_to_display = 3;

    let last = new Date()
    let first = new Date()

    first = last.addDays(-last.getDay())
    last = first.addDays(6)
    first = first.addDays(-(7*(weeks_to_display-1)))
    let dates = getDates(first, last)

    useEffect(() => {
        async function getRecords() {

            const response = await fetch(`http://localhost:5000/record?start=${first}&end=${last}`)
    
            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`;
                // window.alert(message);
                console.log(message)
                return;
            }
            const record = await response.json();
            if (!record) {
                window.alert(`Record not found`);
                return;
            }

            setRecords(record);
        }
    
        getRecords()
    
        return;
    }, [])


    useEffect(() => {
        async function getProgramDays() {
            // get user data
            fetch(`http://localhost:5000/user?name=${_USER}`)
            .then(async (res) => {
                // get user data in json
                res.json()
                .then(async (content) => {
                    console.log(content)
                    // find program data for user
                    const response = await fetch(`http://localhost:5000/program?name=${content[0].program}`)
                    if (!response.ok) {
                        const message = `Could not find program for user ${_USER}: ${response.statusText}`;
                        // window.alert(message);
                        console.log(message)
                        return;
                    }
                    response.json()
                    .then((cont) => {
                        setDateMap(cont[0].days)
                    })
                })
            })
            .catch((e) => {
                // window.alert(e)
                return;
            })
        }

        getProgramDays()
    }, [])

    const WeekReport = (props) => {
        return (
            <div className="row">
                <h2>{props.title}</h2>
            {
            props.days.map((d, i) => {
                return (
                    <DayReport
                        date={d}
                        day=''
                        status=''
                        gotoRecord={() => {navigate(`/record/${formatDateURL(d)}`)}}
                        key={`DayReport-${d}-${i}`}
                    />
                );
            })
            }
            </div>
        )
    }

    /* Single day as clickable box in calendar */
    const DayReport = (props) => (
        <div
            className={props.date.toLocaleDateString() === new Date().toLocaleDateString() ? `${CALENDAR_FORMAT} today` : `${CALENDAR_FORMAT}`}
            onClick={props.gotoRecord}
        >
            <div className="date">{new Date(props.date).toLocaleDateString()}</div>
            <div className="day">{dateMap[new Date(props.date).getDay()] == 0 ? "Rest Day" : ''}</div>
            
        </div>
    );

    // This following section will display the table with the records of individuals.
    return (
        <div className="container-fluid week-report">

            <WeekReport 
            days={dates.slice((weeks_to_display-1) * 7)}
            title="This Week"
            />

            <WeekReport 
            days={dates.slice((weeks_to_display-2) * 7, (weeks_to_display-1)*7)}
            title="Last Week"
            />

            <WeekReport 
            days={dates.slice(0, (weeks_to_display-2) * 7)}
            title={`Week of ${dates[0].toLocaleDateString()}`}
            />
        </div>
    );
}



function formatDateURL(date) {
    return `${date.getFullYear()}${date.getMonth()+1}${date.getDate()}`
}