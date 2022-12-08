import React, { useState, useEffect } from "react";
import {useCookies } from 'react-cookie';

import "../views/css/settings-page.css"

export default function Settings() {
    const [cookies, setCookie] = useCookies(['theme'])
    const [programs, setPrograms] = useState([])
    const [form, setForm] = useState({})
    const [loaded, setLoaded] = useState(false)
    const [programSelection, setProgramSelection] = useState()

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`http://localhost:5000/get-programs`)

            if (!response.ok) {
                const message = `An error has occurred`
                window.alert(message)
            }
            response.json().then((body) => {
                console.log(body)
                setPrograms(body)
            })
        }
        fetchData()
    }, [])

    useEffect(() => {
        async function fetchData() {
            const response = await fetch(`http://localhost:5000/user`)

            if (!response.ok) {
                const message = `An error has occurred`
                window.alert(message)
            }
            response.json().then((body) => {
                console.log(body)
                setForm(body)
                setProgramSelection(body.program)
                setLoaded(true)
            })
        }

        fetchData()
    }, [])


    const saveTheme = (e) => {
        let theme = document.getElementById("color-theme-select").value
        console.log(theme)
        setCookie('ColorTheme', theme, {path:'/'})
        window.location.reload()
    }

    const saveProgram = async (e) => {
        e.preventDefault();
        console.log(form)
        await fetch(`http://localhost:5000/user/update/${form._id}`,
        {
            method: "POST",
            body:JSON.stringify(form),
            headers: {
                'Content-Type':'application/json'
            },
        })
        window.location.reload()

    }

    if (!form || !programs.length) {
        return (
            <div></div>
        )
    }
    return (
        <div className="container-fluid settings-page page-content">
            <h3>Settings Page</h3>

            <div id="program-setting" className="row setting-field">
                <h4>Program</h4>
                <form onSubmit={saveProgram}>

                    <div className="row">
                        <div className="col-xl-2 col-lg-3 col-md-4">
                            <select defaultValue={programSelection} onChange={(e) => setForm({...form, program:e.target.value})} className="form-select-sm">
                                {programs.map((p, i) => {
                                    return (
                                        <option key={`${i}${p.name}`} value={p.name}>{p.name} {programSelection===p.name ? '(Current)': ''}</option>
                                    )
                                })}
                            </select>
                        </div>

                        <div className="form-group col">
                            <input 
                                className="btn btn-success"
                                type="submit"
                                value="Save"
                            />
                        </div>
                    </div>
                </form>
            </div>

            <hr className="setting-hr" />

            <div id="color-theme-setting" className="row setting-field">
                <h4>Color Theme</h4>
                <div className="row">
                    <div className="col-xl-2 col-lg-3 col-md-4">
                        <select defaultValue={cookies.ColorTheme} id="color-theme-select" className="form-select-sm">
                            {['Utopia', 'Seashell', 'Ender', 'Diplomat'].map((c) => {
                                return (
                                    <option key={`${c}`} value={c}>{c}</option>
                                )
                            })}
                        </select>
                    </div>

                    <div className="col">
                        <input 
                        id="theme-button-save"
                        className="btn btn-success"
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