import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

import "../views/css/settings-page.css"

const _USER = "Justin"

export default function Settings() {

    const [theme, setTheme] = useState();
    const [program, setProgram] = useState();

    useEffect(() => {
        async function changeTheme() {
            fetch(`http://localhost:5000/user/update/${_USER}`, {

            })
        }
    }, [theme])

    useEffect(() => {
        async function changeProgram() {
            fetch(`http://localhost:5000/user/update/${_USER}`, {

            })
        }
    }, [program])

    return (
        <div className="container-fluid settings-page">
            <h3>Settings Page</h3>

            <div id="program-setting" className="row setting-field">
                <h4>Program</h4>
                <div className="row">
                    <div className="col-2">
                        <select className="form-select-sm">
                            <option>nSuns 5/3/1</option>
                            <option>PPL 6-day</option>
                        </select>
                    </div>

                    <div className="col">
                        <input 
                        className="btn btn-success btn-sm"
                        type="button"
                        value="Save"
                        onClick="#"
                        />
                    </div>
                </div>
            </div>

            <hr className="setting-hr" />

            <div id="color-theme-setting" className="row setting-field">
                <h4>Color Theme</h4>
                <div className="row">
                    <div className="col-2">
                        <select className="form-select-sm">
                            {['Ardent', 'Starship', 'Seashell', 'Ender', 'Unicorn', 'Diplomat', 'Peachy', 'Bubblegum'].map((c) => {
                                return (
                                    <option>{c}</option>
                                )
                            })}
                        </select>
                    </div>

                    <div className="col">
                        <input 
                        className="btn btn-success btn-sm"
                        type="button"
                        value="Save"
                        onClick="#"
                        />
                    </div>
                </div>
            </div>
            

        </div>
    )
}