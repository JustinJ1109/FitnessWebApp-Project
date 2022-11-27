
import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router";
import {useParams} from 'react-router-dom';

const EmptyDay = {
    date : '',
    day : '', 
    status : ''
}

const DateInfo = (props) => {

    let da = new Date(props.record.date)
    da.setDate(da.getDate() + 1)
    const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];


    let formattedDate = `${weekday[da.getDay()]}, ${da.toLocaleDateString()}`

    return (
        <div className={props.className??''} style={{color:"white", textAlign:'center'}}>
            <h4>{formattedDate}</h4>
        </div>
    )
}

const RoutineTable = (props) => {

    const [hideRow, setHideRow] = useState();

    return (
        <div>
            <table className="routine-table table table-hover table-dark">
                <thead>
                    <tr>
                        <th>Order</th>
                        <th>% Progress</th>
                        <th>test1</th>
                        <th >Sets</th>
                        <th>Reps</th>
                        <th>Weight</th>
                        <th>% 1RM</th>
                    </tr>
                </thead>

                <tbody>
                    {[1,1,2,2,3,3,4,4,5,5,6,6].map((x,i) => {
                        
                        if (i % 2 == 0) {
                            return (
                                <Exercise_Row
                                    number={x}
                                    progress='0'
                                    exercise_name="Bench Press"
                                    sets="3"
                                    reps="5"
                                    weight="155"
                                    percent_rm="85"
                                    target={`subrow-${i+1}`}
                                    key={`${i}-${x}`}
                                    setHideRow={setHideRow}
                                    hideRow={hideRow}
                                />
                            )
                        }

                        else {
                            return (
                                <Sub_Row
                                    className={`subrow-${i} ${hideRow ? 'collapse' : ''}`}
                                    key={`${i}-${x}`}
                                />
                            )
                        }

                        
                    })}
                    
                </tbody>
            </table>
        </div>
    )
}

const Exercise_Row = (props) => {
    return (
        <tr 
        className={props.className??''}
        onClick={()=>props.setHideRow(!props.hideRow)}
        >
            <td>{props.number??''}</td>
            <td>{(props.progress??'') + '%'}</td>
            <td>{props.exercise_name??''}</td>
            <td>{props.sets??''}</td>
            <td>{props.reps??''}</td>
            <td>{(props.weight??'') + 'lbs'}</td>
            <td>{(props.percent_rm??'') + '%'}</td>
        </tr>
    )
}

const Sub_Row = (props) => {
    return (
        <tr className={`subrow ${props.className}`}>
            <td colSpan="2">testing</td>
        </tr>
    )
}

export default function Daily() {

    const { id } = useParams();
    const [record, setRecord] = useState();

    const navigate = useNavigate();

    useEffect(() => {
        async function getToday() {
            const response = await fetch(`http://localhost:5000/record/${id}`);

            if (!response.ok) {
                return;
            }

            const record = await response.json();
            if (!record) {
                window.alert(`Record not found`);
                return;
            }
            setRecord(record);
        }

        getToday();
        console.log('use effect')
    },[])

    const goBack = () => {
        navigate("/");
    }

    return (
        <div>
            <div className="container row">
                <input 
                    type="button"
                    className="col-1 btn btn-dark"
                    value="Back"
                    onClick={goBack}
                />
                <DateInfo
                    className="col"
                    record={record??EmptyDay}
                />
                <div className="col-1" />

            </div>

            <RoutineTable
            />
            
        </div>
    )
}