
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

    


    if (existing === 1 || existing === 0) {
        return (
            <div>
                <h3>{date}</h3>

                <table className="table table-bordered table-hover table-dark">
                    <thead>
                        <tr>
                            <th>Lift</th>
                            <th>Sets</th>
                            <th>Reps</th>
                            <th>Weight (lbs)</th>
                            <th>%1RM</th>
                        </tr>
                    </thead>
                        {volumeMap.map((e, i) => {
                            return (
                                <tbody>

                                    <tr onClick={() => setCollapsed(collapsed ? false : true)}>
                                        <td>{e.name}</td>
                                        <td>{e.sets}</td>
                                        <td>{e.reps.map((r, i) => {
                                            if (i < 2) {
                                                return `${r}, `
                                            }
                                            else if (i === 2) {
                                                return '...'
                                            }
                                            else if (i === e.reps.length-1) {
                                                return `${r}`
                                            }
                                        })}</td>

                                        <td>175, 190, ...175</td>

                                        <td>{e.weight.map((w, i) => {
                                            if (i < 2) {
                                                return `${w}, `
                                            }
                                            else if (i === 2) {
                                                return '...'
                                            }
                                            else if (i === e.weight.length-1) {
                                                return `${w}`
                                            }
                                        })}%</td>
                                        
                                    </tr>
                                    {e.reps.map((r, i) => {

                                        return (
                                            <tr className={collapsed ? 'collapse' : ''}>
                                                <td style={{visibility:"hidden"}}></td>
                                                <td>{i+1}</td>
                                                <td style={{textAlign:"left"}}>{r}</td>
                                                <td>{220 * e.weight[i] / 100}</td>
                                                <td>{e.weight[i]}%</td>
                                            </tr>
                                        )
                                    })}

                                    <tr>
                                        <td style={{visibility:'hidden'}}/>
                                        <td style={{textAlign:'center'}} colSpan="4" onClick={() => {
                                            setCollapsed(collapsed ? false : true)
                                        }
                                        }>{collapsed ? '\u25B8' : '\u25BE'}</td>
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