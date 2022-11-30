import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

export default function Settings() {




    return (
        <div>
            <h3>Settings Page</h3>

            <div id="program-setting" className="setting-field">
                <h4>Program</h4>
                <div className="row">
                    <div className="col-2">
                        <select>
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

            <div id="color-theme-setting" className="setting-field">
                <h4>Color Theme</h4>
                <div className="row">
                    <div className="col-2">
                        <select>
                            {['Atlantic', 'Starship', 'Smoothie', 'Sherbet', 'Ardent'].map((c) => {
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