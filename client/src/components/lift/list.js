import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// import AddLift from "./create";

export default function GetLifts() {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);

    const goBack = () => {
        navigate('/');
    }

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
        const [tags, setTags] = useState([]);
    
        const handleRemoveTag = (e) => {
            const val = e.target.getAttribute("name")
            setTags(tags.filter(tag => tag !== val))
        }

        const handleAddLift = (e) => {
            if (e.key == 'Enter') {
                SubmitNewLift({name:e.target.value, tags:tags})
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
    
                <td rowSpan="3"> 
                    <div className="row">
                        <div className="col">
                        <input
                            type="text"
                            className="col-5 addNew-tags"
                            placeholder="Add Tag" 
                            onKeyDown={(e) => {
                                
                                if (e.key == 'Enter') {
                                    if (e.target.value.length == 0) {
                                        alert("Tag cannot be empty")
                                        return;
                                    }
                                    if (tags.includes(e.target.value)) {
                                        alert("Tag already exists")
                                        return;
                                    }
                                    setTags([...tags, e.target.value])
                                    e.target.value = '';
                                }
                            }}
                        />
                        </div>
                        
                    </div>
                    {tags.map((t, i) => {
                        return (
                        <span 
                            className="tag clickable" 
                            key={`tag-${t}-${i}`}
                            onClick={handleRemoveTag}
                            name={t}
                        >
                            {i!=0?',':''} '{t}'
                        </span>)
                    })}
                </td>
            </tr>
        )
    }

    const Tags = (props) => {
        return (
            <div>
                Placeholder Tag
            </div>
        )
    }
    
    const RecordRow = (props) => {
        const [expand, setExpand] = useState(false);

        return (
            <tr className="lift-row">
                <td>{props.row_num}</td>
                <td>{props.name}</td>

                <td 
                    className={`divider ${expand?'collapsed':''}`}
                    onClick={() => setExpand(!expand)}>
                        {expand?<Tags />:''}
                    </td>
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
            <h2 className="secondary-title">Known Exercises</h2>
            <div className="row">
                <div className="col-2">
                    <div className="row">
                        <input 
                            type="button"
                            value="Back"
                            onClick={goBack}
                            className="btn btn-dark"
                        />
                    </div>
                </div>
                <div className="col table">
                    <table className="table table-bordered table-hover table-dark">
                        <thead>
                            <tr className="lift-row">
                                <th>#</th>
                                <th colSpan="3">Exercise Name</th>
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

