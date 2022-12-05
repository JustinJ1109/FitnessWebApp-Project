import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import "../views/css/calendar-page.css";

const CAL_MAP = require("../db/days_map.json")

const CALENDAR_FORMAT = 'col-lg col-md-4 col-sm-6 '

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

    const [loggedIn, setLoggedIn] = useState(false)
    const [dateMap, setDateMap] = useState([])
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const [volumeMap, setVolumeMap] = useState([])
    

    const weeks_to_display = 3;

    let last = new Date()
    let first = new Date()

    first = last.addDays(-last.getDay())
    last = first.addDays(6)
    first = first.addDays(-(7*(weeks_to_display-1)))
    let dates = getDates(first, last)

    useEffect(() => {
        async function getProgramDays() {                    
            // find program data for user

            console.log("fetching /program for calendar");
            const response = await fetch(`http://localhost:5000/program`)
            if (!response.ok) {
                const message = `Could not find program for user: ${response.statusText}`;
                // window.alert(message);
                console.log(message)
                return;
            }

            response.json().then(async (program_body) => {
                if (program_body.redirectURL) {
                    setLoading(false)
                    return
                }
                setLoggedIn(true)
                setDateMap(program_body.days)
                console.log("fetching /getmap")
                fetch(`http://localhost:5000/program/getmap`)
                .then((response) => {
                    response.json().then((map_body) => {
                        if (map_body.redirectURL) {
                            navigate(map_body.redirectURL)
                            return
                        }
                        setVolumeMap(map_body)
                        setLoading(false)
                    })
                })  
                .catch((err) => {
                    console.log("Problem finding program volume map")
                    return;
                })
            })
        }

        getProgramDays()
    }, [])

    const WeekReport = (props) => {
        return (
            <div className={`week-block row`}>
                <h2>{props.title}</h2>
            {
            props.days.map((d, i) => {
                return (
                    <DayReport
                        date={d}
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
    const DayReport = (props) => {
        let d = new Date(props.date)
        return (
            <div className={`day-content-box ${CALENDAR_FORMAT}`}>
                <div className="day-header">{d.toLocaleDateString()}</div>
                <div
                    className={props.date.toLocaleDateString() === new Date().toLocaleDateString() ? `day-report clickable today` : `day-report clickable`}
                    onClick={props.gotoRecord}
                >
                    <div className="day-of-week">{CAL_MAP[d.getDay()]}</div>
                    <hr className="day-divider" />
                    
                    <DayContent content={dateMap.length ? dateMap[new Date(props.date).getDay()] : []}/>
                    </div>
            </div>
            
        )
        
    };

    const DayContent = (props) => {
        if (loading || !loggedIn) {
            return (
                <div className="day-content-display"></div>
            )
        }
        if (props.content === 0) {
            return (
                <div className="day-content-display">Rest Day</div>
            )
        }
        return (
            <div className="day-content-display">
                {volumeMap.map((v, i) => {
                    if (v && v.position < 3 && props.content === v.day) {
                        return (
                            <div key={`${v.name}-${i}`}>{v.name}</div>
                        )
                    }
                })}
            </div>
        )
        
    }

    // This following section will display the table with the records of individuals.
    return (
        <div className="container-fluid week-report page-content">

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
            title={`2 Weeks Ago`}
            />
        </div>
    );
}



function formatDateURL(date) {
    return `${date.toISOString()}`
}