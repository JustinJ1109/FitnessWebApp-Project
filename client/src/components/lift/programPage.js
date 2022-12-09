import React, {useEffect} from "react";

import { useState } from "react";
import { useNavigate } from "react-router";

export default function GetProgram() {
    // holds all n number of exercises from database
    const [exercises, setExercises] = useState([])
    const [exercisesBackup, setExercisesBackup] = useState([])
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

    const [saved, setSaved] = useState(true)

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
                    setExercisesBackup(body)
                    setLoading([loading[0], false])
                })
            })
        }
        getExercises()
    }, [])

    function isValid() {
        console.log(exercises)
        const res = exercises.forEach(exercise => {
            if (exercise.reps === [] || exercise.weight === []) {
                return false;
            }
            exercise.reps.forEach(rep => {
                if (rep == '' || rep == 0) {
                    console.log("BAD")
                    return false;
                }
            })
            exercise.weight.forEach(w => {
                console.log("w: \'" + w + "\'")

                if (w == '' || w == 0) {
                    console.log("BAD")

                    return false;
                }
            })
        });

        return true && res
    }

    function saveForm(){
        if (!isValid()) {
            window.alert("Please fix the exising mistakes in the form")
            return
        }
        setSaved(true)

        fetch(`http://localhost:5000/program/update`,
        {
            method: "POST",
            body: JSON.stringify(exercises),
            headers: {
                'Content-Type':'application/json'
            }
        }).then((res) => {
            res.json((body) => {
                if (body.succeeded) {
                    window.alert("Updated Exercises")
                }
            })
            .catch((err) => {
                console.log(err)
                return
            })
            
        }).catch((err) => {
            window.alert(err)
            return
        }) 
        // window.location.reload()
    }

    function cancelForm() {

        window.location.reload()
    }

    function newSet(exercise) {
        setSaved(false)

        let newExercise = exercise
        if (newExercise.sets === 0) {
            newExercise.sets = 1
        }
        else {
            newExercise.sets += 1
        }
        newExercise.reps = [...newExercise.reps, '']
        newExercise.weight = [...newExercise.weight, '']

        setExercises(exercises.map((ex) => {
            if (ex.day === newExercise.day && ex.position === newExercise.position) {
                return newExercise
            }
            return ex
        }))
    }

    function removeSet(props) {
        setSaved(false)

        let newExercise = exercises[props.day]

        newExercise.reps = newExercise.reps.filter((r, i) => {
            if (i+1 != props.set) {
                return r
            }
        })
        newExercise.weight = newExercise.weight.filter((w, i) => {
            if (i+1 != props.set) {
                return w
            }
        })
        newExercise.sets -= 1


        setExercises(exercises.map((exercise, i) => {
            if (exercise.day === newExercise.day && exercise.position === newExercise.position) {
                return newExercise
            }
            return exercise
        }))
    }

    // onChange handler for edit fields
    function updateField(props) {
        setSaved(false)
        var newExercise;

        if ("reps" in props) {
            const newReps = exercises[props.j].reps.map((r, i) => {
                if (i === props.set-1) {
                    if (isNaN(props.reps)) {
                        window.alert("Must be a number")
                        return r
                    }
                    
                    return props.reps // user's input
                }
                return r // old value
            })
            newExercise = {...exercises[props.j], reps:newReps} // []
        }
        
        else {
            const newWeight = exercises[props.j].weight.map((w, i) => {
                if (i === props.set-1) {
                    if (isNaN(props.weight)) {
                        window.alert("Must be a number")
                        return w
                    }
                    return props.weight
                }
                return w
            })
            newExercise = {...exercises[props.j], weight:newWeight}
        }

        setExercises(exercises.map((exercise, i) => {
            if (exercise.day === newExercise.day && exercise.position === newExercise.position) {
                return newExercise
            }
            return exercise
        }))
    }

    if (program.dayMap) {
        return (
            <PageContent newSet={newSet} removeSet={removeSet} saved={saved} cancelForm={cancelForm} saveForm={saveForm} updateField={updateField} program={program} exercises={exercises} setEditingExerciseIndex={setEditingExerciseIndex} editingExerciseIndex={editingExerciseIndex}/>
        )
    }
    return (
        <div></div>
    )
}

const SaveChanges = (props) => {
    return (
        <div className="col-2">
            <input type="button" value="Save Changes" className="btn btn-success" onClick={props.saveForm} style={props.saved ? {visibility:'hidden'} : {marginRight:'15px', visibility:'visible'}}/>
            <input type="button" value="Revert" className="btn btn-danger" onClick={props.cancelForm} style={props.saved ? {visibility:'hidden'} : {visibility:'visible'}}/>
        </div>
    )
}
const PageContent = (props) => {

    return (
        <div className="container-fluid page-content program-page" >
            <SaveChanges cancelForm={props.cancelForm} saved={props.saved} saveForm={props.saveForm}/>

            <h2 style={{textAlign:'center'}}>{props.program.rname??props.program.name} Program</h2>
            <div className="row">

                {props.program.dayMap.map((day, i) => {
                    return (
                        <div className="col-xl-6 col-lg-8" key={`${day}-${i}`}>
                            <h4>Day {i+1} ({day})</h4>
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
                                                <tr id={`exercise-row-${exercise.name.replaceAll(" ", "-")}`} className={`exercise-row ${props.editingExerciseIndex===j && 'selected'}`} 
                                                onClick={(e) => {
                                                    if (j === props.editingExerciseIndex) {
                                                        props.setEditingExerciseIndex(-1)
                                                    }
                                                    else {
                                                        props.setEditingExerciseIndex(j)

                                                    }
                                                }}
                                                    key={`${exercise.name}-${i}-${day}`}
                                                >
                                                    <td>{exercise.name}</td>
                                                    <td>{exercise.sets}</td>
                                                </tr>
                                                {props.editingExerciseIndex === j && 
                                                <tr className="editfield"><td colSpan="2">
                                                     <EditField newSet={props.newSet} removeSet={props.removeSet} updateField={props.updateField} exercise={props.exercises[j]} j={j}/>
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
        <div className="row">
            <div className="col">
                <form onSubmit={() => console.log("submitted")}>
                <table className="table table-bordered table-colored">
                    <thead>
                        <tr>
                            <th>Set</th>
                            <th>Reps</th>
                            <th colSpan="2">Weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...Array(props.exercise.sets).keys()].map((i) => {
                            return (
                                <EditFieldRow removeSet={props.removeSet} updateField={props.updateField} j={props.j} key={`fieldrow-${i}`} set={i+1} reps={props.exercise.reps[i]} weight={props.exercise.weight[i]}/>
                            )
                        })}

                        <tr>
                            <td colSpan="4">
                                <div style={{textAlign:'center'}}>
                                    <input type="button" className="btn btn-success" value="Add Set" onClick={() => props.newSet(props.exercise)}/>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                </form>
            </div>
        </div>
    )
}

const EditFieldRow = (props) => {
    return (
        <tr className={`edit-row`}>
            <td>{props.set}</td>
            <td className={`${props.set}-reps`}>
                <input type="text" value={props.reps} onChange={(e) => props.updateField({e:e, j:props.j, set:props.set, reps:e.target.value})}/>
            </td>
            
            <td className={`${props.set}-weight`}>
                <input type="text" value={props.weight} onChange={(e) => props.updateField({e:e, j:props.j, set:props.set, weight:e.target.value})}/>
            </td>
            
            <td><input type="button" value="X" className="btn btn-danger" onClick={() => props.removeSet({day:props.j, set:props.set})}/></td>
        </tr>
    )
}
