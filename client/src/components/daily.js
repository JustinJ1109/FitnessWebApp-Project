
import React, { useEffect, useState} from "react";
import { useNavigate } from "react-router";
import {useParams} from 'react-router-dom';

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

    const SetRow = (props) => {
        return (
            <tr className={`set-row ${props.name != '' ? 'titled-row' : ''} ${collapsed && props.name == '' ? 'collapse' : ''}`}>
                <td 
                onClick={props.name != '' ? () => setCollapsed(!collapsed) : () => setCollapsed(collapsed)} 
                style={props.name == '' ? {visibility:"hidden",border:'0'} : {}}
                className={props.name != '' ? 'name-cell-hover' : ''}
                >
                    <div className="row">
                        <div className="col">
                            {props.name}
                        </div>

                        <div className="col-xl-1 col-lg-2 col-md-3 col-sm-2">
                            {collapsed ? `\u23F5` : '\u23F7'}
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
            <div>
                <h3>{date}</h3>

                <table className="lift-table table table-bordered table-dark">
                    <thead>
                        <tr>
                            <th>Lift</th>
                            <th>Reps @ Weight (lbs)</th>
                            <th>%1RM</th>
                        </tr>
                    </thead>
                        {volumeMap.map((e, i) => {
                            return (
                                <tbody className="workout-body">

                                    {/* <tr >
                                        <td className="col-2 name-cell-hover" onClick={() => setCollapsed(collapsed ? false : true)}>
                                            <div className="row">
                                            <span className="col dropdown-name">{e.name}</span> 
                                            <span className="col-xl-1 col-lg-2 col-sm-12 dropdown-triangle">{collapsed ? '\u25B8' : '\u25BE'}</span>
                                            </div>
                                        </td>
                                        <td className="col-2">
                                            <div className="row">
                                                <div className="col">
                                                {`${e.reps[0]} reps @ ${220 * e.weight[0] / 100} lbs`}

                                                </div>
                                                <div className="col-2">
                                                    {'\u2713'}
                                                </div>

                                            </div>
                                            
                                        </td>

                                        <td className="col-2">{e.weight[0]}%</td>
                                        
                                    </tr> */}
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
                                                // <tr className={collapsed ? 'collapse' : ''}>
                                                //     <td style={{visibility:"hidden"}}></td>
                                                //     <td>
                                                //         <div className="row"> 
                                                //             <div className="col">
                                                //                 {`${r} reps @ ${220 * e.weight[i] / 100} lbs`}

                                                //             </div>

                                                //             <div className="col-2">
                                                //                 {'\u2713'}
                                                //             </div>
                                                //         </div>
                                                //     </td>
                                                //     <td>{e.weight[i]}%</td>
                                                    
                                                // </tr>
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

        

        return (
            <div>
                <h3>{date}</h3>
                <div>I dont exist</div>
                <input
                className="btn btn-dark"
                type="button"
                value="Back"
                onClick={goBack}
                />
            </div>
        )
        
    }
    function expandWorkout() {
        
    }

    // pre-load
    return (
        <div></div>
    )
}