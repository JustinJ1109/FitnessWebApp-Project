import React, {useEffect} from "react";

import { useState } from "react";
import { useNavigate } from "react-router";

export default function GetProgram() {
    const navigate = useNavigate();
    const [editingLift, setEditingLift] = useState(false)
    const [exercises, setExercises] = useState([])
    const [addingSet, setAddingSet] = useState(false)
    const [loading, setLoading] = useState([true, true])
    const [addingExercise, setAddingExercise] = useState(false)

    const [program, setProgram] = useState({
        days: [],
        name : '',
        _id : null
    })
    const [editForm, setEditForm] = useState({
        name: 'test',
        sets: 0,
        reps: [],
        weight : []
    })

    function updateForm(value) {
        console.log("updating form")
        return setEditForm((prev) => {
            return {...prev, ...value}
        })
    }

    function updateSet(value) {
        console.log("updatingset")
        // updating existing
        if (value.set < editForm.sets) {
            if (value.reps) {

                return setEditForm((prev) => {
                    const newReps = [...editForm.reps]
                    newReps[value.set] = value.reps
                    return {
                        ...prev,
                        reps : [...newReps]
                    }
                }) 
            }
            // value.weight 
            else {
                const newWeight = [...editForm.weight]
                newWeight[value.set] = value.weight

                return setEditForm((prev) => {
                    return {
                        ...prev,
                        weight : [...newWeight]
                    }
                }) 
            }
        }
        // creating new
        else {

        }
    }

    function removeSet(e) {
        if (window.confirm("Are you sure you want to delete the row?")){
            
        }
    }

    useEffect(() => {
        console.log('getProgInfo running')
        async function getProgramInfo() {
            fetch(`http://localhost:5000/program`).then((res) => {
                res.json().then((body) => {
                    setProgram(body)
                    setLoading([false, loading[1]])
                    console.log(body)
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
        console.log('getExercises running')

        async function getExercises() {
            fetch(`http://localhost:5000/program/getmap`).then((res) =>{
                res.json().then((body) => {
                    // console.log('body')
                    // console.log(body)
                    setExercises(body)
                    console.log(body)
                    setLoading([loading[0], false])
                })
            })
        }
        getExercises()
    }, [])

    const AddExercise = (props) => (
        
        <div>
            <input 
                type="button"
                className="btn btn-danger"
                value="Cancel"
                onClick={() => setAddingExercise(false)}
                />
            <div>
                ADDING
            </div>
        </div>
    )


    const AddSetField = () => (
        <tbody>
            <tr>
                <td>{editForm.sets+1}</td>
                <td>
                    <input 
                    type="text"
                    placeholder="# reps"
                    onChange={(e) => updateSet({set: editForm.sets, reps: e.target.value})}
                    />
                </td>
                <td>
                    <input 
                    type="text"
                    placeholder="%1RM"
                    onChange={(e) => updateSet({set:editForm.sets, weight: e.target.value})}
                    />
                </td>
                <td>
                    <input 
                    type="button"
                    className="btn btn-danger"
                    value="X"
                    onClick={removeSet}
                    />
                </td>
            </tr>
        </tbody>
    )

    const EditLift = () => {
        return (
            <div className="col-8">
                <form>
                    <div className="row form-group">
                        <div className="col-3"><label htmlFor="exercise-name">Exercise Name</label></div>
                        <div className="col-4"><input 
                        type="text"
                        className="form-control"
                        value={editForm.name??''}
                        onChange={(e) => updateForm({name: e.target.value})}
                        />
                        </div>
                    </div>

                    <div className="row form-group">
                        <div className="col">

                            <table className="table table-bordered table-colored">
                                <thead>
                                    <tr>
                                        <th>Set</th>
                                        <th>Reps</th>
                                        <th>%1RM</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {editForm.reps.map((r, i) => {
                                        return (
                                            <tr key={`${i}-editForm`}>
                                                <td>
                                                    {i+1}
                                                </td>
                                                <td>
                                                    <input 
                                                    type="text"
                                                    className="form-control"
                                                    value={r??''}
                                                    onChange={(e) => {
                                                        setEditForm((prev) => {
                                                            const newReps = [...editForm.reps]
                                                            newReps[i] = e.target.value
                                                            return {
                                                                ...prev,
                                                                reps : [...newReps]
                                                            }
                                                        }) 
                                                    }}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                    type="text"
                                                    value={editForm.weight[i]??''}
                                                    onChange={(e) => {
                                                        const newWeights = [...editForm.weights]
                                                            newWeights[i] = e.target.value
                                                        setEditForm((prev) => {
                                                            return {
                                                                ...prev,
                                                                weights : [...newWeights]
                                                            }
                                                        }) 
                                                    }}
                                                    />
                                                </td>
                                                <td>
                                                    <input 
                                                    type="button"
                                                    className="btn btn-danger"
                                                    value="X"
                                                    onClick={removeSet}
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    })}
                                    <tr>
                                            
                                    </tr>
                                </tbody>

                                {addingSet? <AddSetField /> : <tbody />}
                            </table>

                            <input 
                            type="button"
                            className="btn btn-success"
                            value="Add Set"
                            onClick={() => setAddingSet(true)}
                            />
                            
                        </div>
                    </div>
                </form>
            </div>
        )
    }

    if (program.dayMap) {
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
                                    <tbody>

                                    {exercises.map((e) => {
                                        if (e.day === i+1) {
                                            return (
                                                <tr onClick={() => {
                                                    setEditForm({
                                                        name:e.name,
                                                        sets:e.sets,
                                                        reps:e.reps,
                                                        weight:e.weight
                                                    })

                                                    setEditingLift(true)
                                                
                                                }} key={`${e.name}-${i}-${day}`}>
                                                    <td>{e.name}</td>
                                                    <td>{e.sets}</td>
                                                </tr>
                                                
                                            )
                                        }
                                    })}
                                    </tbody>

                                </table>

                                {addingExercise ? <AddExercise /> : <input 
                                type="button"
                                className="btn btn-success"
                                value="Add Exercise"
                                onClick={() => setAddingExercise(true)}/>}
                            </div>
                        )
                    })}

                </div>
                
                {editingLift ? <EditLift /> : <div />}

            </div>
        )
    }
    return (
        <div></div>
    )
    
}