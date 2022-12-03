
import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router";
import {useParams} from 'react-router-dom';

import "../views/css/daily-page.css";
import PenguinImage from "../db/pengwin.png";

import GetLifts from "./lift/lift-table";

let date_map = require("../db/days_map.json")

function getDateDayValue(date) {
    return new Date(date).getDay()
}

export default function DayInfo() {
    const { date } = useParams();
    const [volumeMap, setVolumeMap] = useState([]);
    const [userData, setUserData] = useState([])
    const [creating, setCreating] = useState(false);

    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function getVolMap() {
            fetch(`http://localhost:5000/user`)
            .then((user_res) => {
                user_res.json()
                .then((body) => {
                    setUserData(body[0])
                    fetch(`http://localhost:5000/program/getmap/${body[0].program.replaceAll("/", "%2F")}?day=${getDateDayValue(date)}`)
                    .then((map_res) => {
                        map_res.json()
                        .then((body) => {
                            if (body.redirectURL) {
                                navigate(body.redirectURL)
                                return
                            }
                            setVolumeMap(body)
                            setLoading(false)
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

    async function onSubmit(e) {

    }

    function updateForm(value) {
        console.log(value)
    }

    const expandRow = (e) => {

        let bodyId = e.target.firstChild.firstChild.textContent.replace(" ", "") + '-body';
        let body = document.getElementById(bodyId);
        let children = body.children;

        for (let i = 0; i < children.length; i++) {

            if (i > 0 && i < children.length-1) {
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

    const addCheckMark = (e) => {
        let checkBox = e.target.querySelector(":nth-child(2)")


        if (checkBox.style.visibility === 'hidden') {
            checkBox.style.visibility = 'visible'
        }
        else {
            checkBox.style.visibility = 'hidden'
        }


    }

    const addClicked = (e) => {
        console.log(e)
    }

    const CreateNewForm = (props) => {
        
        return (
            <div>

                <div>
                    <h2>Add</h2>
                    <GetLifts
                        onClickRow={addClicked}
                        onBack={props.onClick}></GetLifts>
                </div>

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <input 
                            type="text"
                            placeholder="Name"
                            id="new-lift-name-field"
                            onChange={(e) => updateForm({name : e.target.value})}
                        />
                    </div>
                </form>
            </div>
        )
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

                        <div id="arrow-collapser" className="col-xl-2.5 col-lg-2 col-md-3 col-sm-3">
                            {props.name != '' ? collapsed ? `\u23F5` : '\u23F7' : ''}
                        </div>
                    </div>
                </td>
                <td className="rep-cell-hover" onClick={addCheckMark}>
                    <div className="row" style={{pointerEvents:'none'}}> 
                        <div className="col">
                            {`${props.reps} reps @ ${220 * parseInt(props.weight, 10) / 100} lbs`}
                        </div>

                        <div style={{visibility:'hidden'}} className="checkmark col-2">
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

    // pre-load
    if (loading) {
        return (
            <div></div>
        )
    }
    
    // rest day
    if (volumeMap.length === 0) {

        return (
            <div className="container-fluid daily-report">
                <h3 className="subtitle date-display">{date_map[new Date(date).getDay()]}, {new Date(date).toLocaleDateString()}</h3>

                
                <div className="row">
                    <div className="col-1-md col0.5-sm">
                    <input
                        className="btn btn-dark"
                        type="button"
                        value="Back"
                        onClick={goBack}
                    />
                    </div>
                    <div className="col">
                        <h3 className="rest-day-display rest-day-title">Rest Day</h3>

                        <h4 className="rest-day-display rest-day-text">Use this time to relax, you've earned it!</h4>

                        <img className="rest-day-image" alt="Really cool penguin" src={PenguinImage}/>

                    </div>
                    <div className="col-1-md" />

                </div>
                
                
                </div>
        )
    }

    return (
        <div className="container-fluid daily-report page-content">
            <div className="row">
                <div className="col-4 date-object">
                    <h3 className="subtitle date-display">{date_map[new Date(date).getDay()]}, {new Date(date).toLocaleDateString()}</h3>
                </div>
                <div className="col-4 progress-object">
                    <div className="progress-status">
                        0%
                    </div>
                    <div className="progress-bar">

                    </div>
                </div>
                <div className="col-4" />
            </div>
            
            <div className="row">
                <div className="col">
                <input
                    className="btn btn-dark"
                    type="button"
                    value="Back"
                    onClick={goBack}
                />
                </div>
                <div className="col-xl-10 col-lg-9 col-md-11">
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
                                            <td className="lift-dividers-collapsed" colSpan="3" />
                                        </tr>
                                    </tbody>
                                )
                            })}
                    </table>
                    
                    {creating ? <CreateNewForm 
                                    onClick={() => setCreating(false)}
                    
                    /> : <input 
                        className="create-new-lift-btn btn btn-success"
                        type="button"
                        value="Add new lift"
                        onClick={() => setCreating(true)}
                    />}
                    
                </div>
                
                <div className="col" />

            </div>
            
            
            
        </div>
    )
}