import React, {useEffect} from "react";

import { useState } from "react";
import { useNavigate } from "react-router";

export default function GetProgram() {
    const [exercises, setExercises] = useState([])
    const [editingExercise, setEditingExercise] = useState()
    const [editingExerciseIndex, setEditingExerciseIndex] = useState(-1)
    const [loading, setLoading] = useState([true, true])

    const [program, setProgram] = useState({
        days: [],
        name : '',
        _id : null
    })

    function removeSet(e) {
        if (window.confirm("Are you sure you want to delete the row?")){
            
        }
    }

    useEffect(() => {
        // console.log('getProgInfo running')
        async function getProgramInfo() {
            fetch(`http://localhost:5000/program`).then((res) => {
                res.json().then((body) => {
                    setProgram(body)
                    setLoading([false, loading[1]])
                    // console.log(body)
                })
            })
            .catch((err) => {
                console.log(`**ERR: ${err}`)
                return
            })
        }

        getProgramInfo()
    }, [])

    useEffect(() => {
        async function getExercises() {
            fetch(`http://localhost:5000/program/getmap`).then((res) =>{
                res.json().then((body) => {
                    
                    setExercises(body)
                    setLoading([loading[0], false])
                })
            })
        }
        getExercises()
    }, [])

    const PageContent = (props) => {
        return (
            <div className="container-fluid page-content program-page" >
                <h2 style={{textAlign:'center'}}>{program.rname??program.name} Program</h2>
                <div className="row">
                    {program.dayMap.map((day, i) => {
                        return (
                            <div className="col" key={`${day}-${i}`}>
                                <h4>{day}</h4>
                                <hr />
                                <table className="lift-table table table-bordered table-colored">
                                    <thead>
                                        <tr>
                                        <th>Name</th>
                                        <th>Sets</th>
                                        </tr>
                                    </thead>
                                    {exercises.map((exercise, j) => {
                                        if (exercise.day === i+1) {
                                            return (
                                                <tbody key={`${exercise.name}${i}${day}`}>
                                                    <tr id={`exercise-row-${exercise.name.replaceAll(" ", "-")}`} className={`exercise-row`} 
                                                    onClick={() => {
                                                        
                                                        console.log(i)
                                                        console.log(j)
                                                        console.log(exercise.day)
                                                        console.log(exercise)
                                                        setEditingExerciseIndex(j)
                                                        setEditingExercise(exercise)
                                                    }}
                                                        key={`${exercise.name}-${i}-${day}`}
                                                    >
                                                        <td>{exercise.name}</td>
                                                        <td>{exercise.sets}</td>
                                                    </tr>
                                                    <EditField exercise={editingExercise??undefined} j={j} id={`exercise-row-${exercise.name.replaceAll(" ", "-")}-editor`} className={`exercise-row-editor`}/>
                                                        
                                                </tbody>
                                                
                                            )
                                        }
                                    })}
                                </table>
                                {/* <input 
                                type="button"
                                className="btn btn-success"
                                value="Add Exercise"
                                onClick={() => setAddingExercise(true)}
                                /> */}
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    const EditField = (props) => {
        if (props.exercise) {
            return (
                <tr id={props.id} className={`${props.className} ${props.j === editingExerciseIndex ? '' : 'collapse'}`} >
                    <td colSpan="2">
                        <table className="table table-bordered table-colored">
                            <thead>
                                <tr>
                                    <th>Set</th>
                                    <th>Reps</th>
                                    <th>Weight</th>
                                </tr>
                            </thead>
                            <tbody>
                                {props.exercise.reps.map((r, i) => {
                                    return (
                                        <tr key={`${r}${i}${props.exercise.name}`}>
                                            <td>{i+1}</td>
                                            <td>
                                                <input 
                                                name="reps"
                                                className="reps-field"
                                                type="text"
                                                value={r}
                                                onChange={(e) => {
                                                    const newReps = props.exercise.reps.map((r2, i2) => {
                                                        if (i2 === i) {
                                                            return parseInt(e.target.value,10)
                                                        }
                                                        return r2
                                                    })
                                                    console.log(newReps)
                                                    setEditingExercise({...props.exercise, reps:newReps})
                                                    console.log({...props.exercise, reps:newReps})

                                                    const newExercises = exercises.map((exer) => {
                                                        if (exer.day === editingExercise.day && exer.position === editingExercise.position) {
                                                            return editingExercise
                                                        }
                                                        return exer
                                                    })
                                                    console.log(newExercises)
                                                    
                                                }}
                                                />
                                            </td>
                                            <td><input 
                                                name="weight"
                                                className="weight-field"
                                                type="text"
                                                value={props.exercise.weight[i]}
                                                onChange={(e) => {
                                                    setEditingExercise({...editingExercise, [e.target.name]:e.target.value})
                                                }}
                                                />
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </td>
                    
                </tr> 
            )
        }   
        return <tr></tr>    
        
    }

    if (program.dayMap) {
        return (
            <PageContent />
        )
    }
    return (
        <div></div>
    )

    
    
}