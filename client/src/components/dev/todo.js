import React from "react";
import "../../views/css/dev.css";


export default function Todo() {

    return (
        <div>
            
            <ul>
                <li className="askprof smallfix">Delete all entries from DB (or make new?)</li>
                <li className="askprof medfix" >get 7 days consistent for home page for each week interval (no data if empty)</li>
                <li className="bigfix">Add progress charts
                    <ul>
                        <li>Want to see progression and breakdown of notable changes over weeks</li>
                    </ul>
                </li>
                <li className="medfix">Create list of exercises that can be added and removed</li>
                <li className="smallfix">Have multiple routines at once add/remove (e.g. run and lift)</li>
                <li className="medfix">Make UI UX better
                    <ul>
                        <li>Round corners</li>
                        <li>Animations</li>
                        <li>Layout</li>
                        <li>Color palette</li>
                    </ul></li>
                <li className="smallfix">Remove Home page (redundant, progress?)</li>
                <li className="optional">user login
                    <ul>
                        <li className="bigfix">Save status and user settings/custom workouts</li>
                    </ul>
                </li>
                <li className="askprof">change clicking on days from GET to hide ID?</li>
                <li className="medfix">placeholder calendar spots for pre-load data</li>

            </ul>
        </div>
    )
}