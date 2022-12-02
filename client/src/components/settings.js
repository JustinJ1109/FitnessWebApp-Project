import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import {useCookies } from 'react-cookie';

import "../views/css/settings-page.css"

const _USER = "Justin"

export default function Settings() {
    const [cookies, setCookie] = useCookies(['theme'])
    const [theme, setTheme] = useState({
        theme:''
    });
    const [program, setProgram] = useState({
        program:''
    });

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`http://localhost:5000/user/${_USER}`, {

            })

            if (!response.ok) {
                const message = `An error has occurred`
                window.alert(message)
            }
        }
    }, [theme])


    const saveTheme = (e) => {
        let theme = document.getElementById("color-theme-select").value
        console.log(theme)
        setCookie('ColorTheme', theme, {path:'/'})
        window.location.reload()
    }

    const saveProgram = (e) => {
        console.log(e)
    }

    return (
        <div className="container-fluid settings-page page-content">
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
                        onClick={saveProgram}
                        />
                    </div>
                </div>
            </div>

            <hr className="setting-hr" />

            <div id="color-theme-setting" className="row setting-field">
                <h4>Color Theme</h4>
                <div className="row">
                    <div className="col-2">
                        <select defaultValue={cookies.ColorTheme} id="color-theme-select" className="form-select-sm">
                            {['Ardent', 'Starship', 'Seashell', 'Ender', 'Unicorn', 'Diplomat', 'Peachy', 'Bubblegum'].map((c) => {
                                return (
                                    <option value={c}>{c}</option>
                                )
                            })}
                        </select>
                    </div>

                    <div className="col">
                        <input 
                        id="theme-button-save"
                        className="btn btn-success btn-sm"
                        type="button"
                        value="Save"
                        onClick={saveTheme}
                        />
                    </div>
                </div>
            </div>
            

        </div>
    )
}