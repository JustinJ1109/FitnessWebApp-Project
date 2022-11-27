import React, { useState } from "react";
import { useNavigate } from "react-router";
import "../../views/css/main.css";

export default function AddLift() {

    const [form, setForm] = useState({
        name: '',
        tags : []
    })

    const navigate = useNavigate();

    const goBack = () => {
        navigate('/');
        };

    function updateForm(value) {
        return setForm((prev) => {
            return {...prev, ...value}
        })
    }

    async function onSubmit(e) {
        e.preventDefault();

        const newLift = {...form};

        await fetch(`http://localhost:5000/lift_library/add`, {
            method: "POST",
            headers: {
                "Content-Type" : "application/json",
            },
            body: JSON.stringify(newLift)
        })
        .catch(error => {
            window.alert(error);
            return;
        })

        setForm({name: '', tags: []})
        navigate("/lift")
    }

    return (
        <div>
            <h3>Add New Lift</h3>

            <form onSubmit={onSubmit}>
                <div className="row form-group">
                    <div className="col" />
                    <div className="col-4"><label htmlFor="name">Name</label>
                    <input
                            type="text"
                            className="form-control"
                            id="name-field"
                            value={form.name}
                            onChange={(e) => updateForm({name: e.target.value})}
                        /></div>
                    <div className="col" />
                </div>

                <div className="row form-group">
                    <div className="col" />
                    <div className="col-4"><label htmlFor="tags">Tags</label>
                    <input
                            type="text"
                            className="form-control"
                            id="tags-field"
                            value={form.tags}
                            onChange={(e) => updateForm({tags: e.target.value})}
                        /></div>
                    <div className="col" />
                </div>
            </form>
        </div>
        
    )
}