
import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router";
import {useParams} from 'react-router-dom';

import "../views/css/daily-page.css";

let date_map = require("../db/days_map.json")

function getDateDayValue(date) {
    return new Date(date).getDay()
}

const _USER = "Justin"

export default function Daily() {

    const { date } = useParams();
    const [record, setRecord] = useState();
    const [volumeMap, setVolumeMap] = useState([]);
    const [userData, setUserData] = useState([])
    const [collapsed, setCollapsed] = useState(true)

    const [existing, setExisting] = useState(-1);

    const navigate = useNavigate();

    useEffect(() => {
        async function getToday() {
            const response = await fetch(`http://localhost:5000/record/${new Date(date).toLocaleDateString().replaceAll("/", "%2F")}`);

            if (!response.ok) {
                // error
                window.alert("Something went wrong")
            }
            
            const record = await response.json();
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

    useEffect(() => {
        async function getVolMap() {
            fetch(`http://localhost:5000/user?name=${_USER}`)
            .then((user_res) => {
                user_res.json()
                .then((body) => {
                    setUserData(body[0])
                    fetch(`http://localhost:5000/program/getmap/${body[0].program.replaceAll("/", "%2F")}?day=${getDateDayValue(date)}`)
                    .then((map_res) => {
                        map_res.json()
                        .then((body) => {
                            setVolumeMap(body)
                        })
                        .catch((e) => console.log(e))
                    })
                    .catch((e) => console.log(e))
                })
                .catch((e) => console.log(e))
            })
            .catch((e) => console.log(e))


        }

        getVolMap()
    }, [volumeMap.length])

    const goBack = () => {
        navigate("/");
    }

    const expandRow = (e) => {

        
        let bodyId = e.target.firstChild.firstChild.textContent.replace(" ", "") + '-body';
        let body = document.getElementById(bodyId);
        let children = body.children;

        for (let i = 0; i < children.length; i++) {

            if (i > 0) {
                let child = children[i];
                if (child.classList.contains("collapse")) {
                    child.classList.remove("collapse")
                }
                else {
                    child.classList.add("collapse")
                }
            }
            
        }

    
        
        


    }

    const SetRow = (props) => {

        let collapsed = true
        return (
            <tr className={`set-row ${props.name != '' ? 'titled-row' : ''} ${collapsed && props.name == '' ? 'collapse' : ''}`}>
                <td 
                className={props.name != '' ? 'name-cell-hover' : 'empty-cell'}
                onClick={expandRow}
                style={props.name == '' ? {pointerEvents:'none',border:'0'} : {}}
                >
                    <div className="row" style={{pointerEvents:'none'}}>
                        <div className="col">
                            {props.name}
                        </div>

                        <div id="arrow-collapser" className="col-xl-1 col-lg-2 col-md-3 col-sm-2">
                            {props.name != '' ? collapsed ? `\u23F5` : '\u23F7' : ''}
                        </div>
                    </div>
                </td>
                <td className="name-cell-hover">
                    <div className="row"> 
                        <div className="col">
                            {`${props.reps} reps @ ${220 * parseInt(props.weight, 10) / 100} lbs`}
                        </div>

                        <div className="col-2">
                            {'\u2713'}
                        </div>
                    </div>
                </td>
                <td>
                    {props.weight}%
                </td>
                
            </tr>
        )
    }

    
    if (existing === 1 || existing === 0) {
        return (
            <div className="container-fluid daily-report">
                <h3 className="subtitle date-display">{date_map[new Date(date).getDay()]}, {new Date(date).toLocaleDateString()}</h3>

                <table className="lift-table table table-bordered table-colored">
                    <thead>
                        <tr>
                            <th>Lift</th>
                            <th>Reps @ Weight (lbs)</th>
                            <th>%1RM</th>
                        </tr>
                    </thead>
                        {volumeMap.map((e, i) => {
                            return (
                                <tbody key={`${e.name}-${i}-body`} id={`${e.name.replace(" ", "")}-body`} className={`workout-body`}>

                                    {e.reps.map((r, i) => {
                                        if (i === 0) {
                                            return (
                                                <SetRow 
                                                    key={e.name + '-' + i}
                                                    name={e.name}
                                                    reps={r}
                                                    weight={e.weight[i]}
                                                />
                                            )
                                            
                                        }
                                        if (i > 0)
                                            return (
                                                <SetRow 
                                                    key={e.name + '-' + i}
                                                    name=''
                                                    reps={r}
                                                    weight={e.weight[i]}
                                                    
                                                />
                                            )
                                    })}
                                    <tr>
                                        <td className="lift-dividers-collapsed" style={collapsed ? {} :{visibility:'hidden'}} colSpan="3" />
                                    </tr>
                                </tbody>
                            )
                        })}
                </table>
                
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