import React from "react";
import { useEffect, useState } from "react";

import "../../views/css/main.css"

// import AddLift from "./create";

export default function LiftTable(props) {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        async function getLifts() {
            const response = await fetch(`http://localhost:5000/lift_library/`);
            if (!response.ok) {
                return;
            }
        
            const record = await response.json();
    
            setRecords(record)
            // console.log(records)
        }
        getLifts();
        return;
        
    }, [records.length])

    async function SubmitNewLift(newLift) {
        console.log("newlift")
        console.log(newLift)

        await fetch(`http://localhost:5000/lift_library/add`, {
            method: "POST",
            headers: {
                'Content-Type' : 'application/json',
            },
            body: JSON.stringify(newLift)
        })
        .catch(error => {
            window.alert(error)
            return;
        })

        setRecords([...records, newLift])
    }

    const GotoEdit = () => {

    }
    
    const GotoDelete = () => {
    
    }
    
    const AddNewRow = (props) => {
    

        const handleAddLift = (e) => {
            if (e.key == 'Enter') {
                SubmitNewLift({name:e.target.value, custom:true})
            }
        }
        
        return (
            <tr className="lift-row add-row">
                <td>{props.num}</td>
                <td>
                    <input 
                        className="addNew-input"
                        type="text"
                        placeholder="New Field"
                        onKeyDown={handleAddLift}
                    />
                </td>
                <td></td>
    
                
            </tr>
        )
    }
    
    const RecordRow = (props) => {

        return (
            <tr className="lift-row" onClick={props.addClicked}>
                <td>{props.row_num}</td>
                <td>{props.name}</td>

                
                <td className="col-4">
                    <input 
                        type="button"
                        value="Edit"
                        onClick={GotoEdit}
                        className="btn btn-light"/>
                    
                    <input 
                        type="button"
                        value="Remove"
                        onClick={GotoDelete}
                        className="btn btn-danger"/>
                </td>
            </tr>
        )
    }
    
    return (
        <div className="container-fluid page-content lift-list-page">
            <div className="row">
                <div className="col-2">
                    <div className="row">
                        <input 
                            type="button"
                            value="Back"
                            onClick={props.onBack}
                            className="btn btn-dark"
                        />
                    </div>
                </div>
                <div className="col table">
                    <table className="lift-table table table-bordered table-colored">
                        <thead>
                            <tr className="lift-row">
                                <th>#</th>
                                <th>Exercise Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[...records].map((rec, i) => {
                                return (
                                    <RecordRow row_num={i+1} name={rec.name} key={i}/>
                                )
                            })}
                            <AddNewRow num={records.length + 1}/>
                        </tbody>
                    </table>
                </div>
                <div className="col-2" />
            </div>
        </div>
    )
}

