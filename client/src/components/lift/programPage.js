import React, {useEffect} from "react";

import { useState } from "react";
import { useNavigate } from "react-router";

export default function GetProgram() {
    // holds all n number of exercises from database
    const [exercises, setExercises] = useState([])
    // number that holds which exercises is currently being shown/edited
    const [editingExerciseIndex, setEditingExerciseIndex] = useState(-1)
    // once both effects have fetched the data
    const [loading, setLoading] = useState([true, true])
    // holds info about the program to map for exercise displaying
    const [program, setProgram] = useState({
        days: [],
        name : '',
        _id : null
    })

    useEffect(() => {
        async function getProgramInfo() {
            fetch(`http://localhost:5000/program`).then((res) => {
                res.json().then((body) => {
                    setProgram(body)
                    setLoading([false, loading[1]])
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

    // onChange handler for edit fields
    function updateField(props) {

        var newExercise;

        if (props.reps) {
            const newReps = exercises[props.j].reps.map((r, i) => {
                if (i === props.set-1) {
                    return parseInt(props.reps,10) // user's input
                }
                return r // old value
            })
            newExercise = {...exercises[props.j], reps:newReps} // []
            console.log(newExercise)
        }
        
        else {
            const newWeight = exercises[props.j].weight.map((w, i) => {
                if (i === props.set-1) {
                    return props.weight
                }
                return w
            })
            newExercise = {...exercises[props.j], weight:newWeight}
        }
        console.log([...exercises, newExercise])

        setExercises(exercises.map((exercise, i) => {
            if (exercise.day === newExercise.day && exercise.position === newExercise.position) {
                return newExercise
            }
            return exercise
        }))
    }

    if (program.dayMap) {
        return (
            <PageContent updateField={updateField} program={program} exercises={exercises} setEditingExerciseIndex={setEditingExerciseIndex} editingExerciseIndex={editingExerciseIndex}/>
        )
    }
    return (
        <div></div>
    )
}
const PageContent = (props) => {
    return (
        <div className="container-fluid page-content program-page" >
            <h2 style={{textAlign:'center'}}>{props.program.rname??props.program.name} Program</h2>
            <div className="row">
                {props.program.dayMap.map((day, i) => {
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
                                {props.exercises.map((exercise, j) => {
                                    if (exercise.day === i+1) {
                                        return (
                                            <tbody key={`${exercise.name}${i}${j}${day}`}>
                                                <tr id={`exercise-row-${exercise.name.replaceAll(" ", "-")}`} className={`exercise-row`} 
                                                onClick={() => {
                                                    props.setEditingExerciseIndex(j)
                                                }}
                                                    key={`${exercise.name}-${i}-${day}`}
                                                >
                                                    <td>{exercise.name}</td>
                                                    <td>{exercise.sets}</td>
                                                </tr>
                                                {props.editingExerciseIndex === j && <tr><td colSpan="2">
                                                     <EditField updateField={props.updateField} exercise={props.exercises[j]} j={j}/>
                                                </td></tr>}
                                            </tbody>
                                        )
                                    }
                                })}
                            </table>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

const EditField = (props) => {
    return (
        <div>
            <form onSubmit={() => console.log("submitted")}>
            <table className="table table-bordered table-colored">
                <thead>
                    <tr>
                        <th>Set</th>
                        <th>Reps</th>
                        <th>Weight</th>
                    </tr>
                </thead>
                <tbody>
                    {[...Array(props.exercise.sets).keys()].map((i) => {
                        return (
                            <EditFieldRow updateField={props.updateField} j={props.j} key={`fieldrow-${i}`} set={i+1} reps={props.exercise.reps[i]} weight={props.exercise.weight[i]}/>
                        )
                    })}
                </tbody>
            </table>
            </form>

        </div>
    )
}

const EditFieldRow = (props) => {
    console.log("Rendering Edit Field Row")
    return (
        <tr>
            <td>{props.set}</td>
            <td><input key="reps-input" type="text" value={props.reps} onChange={(e) => props.updateField({j:props.j, set:props.set, reps:e.target.value})}/></td>
            <td><input key="weight-input" type="text" value={props.weight} onChange={(e) => props.updateField({j:props.j, set:props.set, weight:e.target.value})}/></td>
        </tr>
    )
}
