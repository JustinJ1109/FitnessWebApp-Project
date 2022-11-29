import React from "react";
import "../../views/css/dev.css";


export default function Todo() {

    return (
        <div className="row">

            <div className="col">
                <ul>
                    
                    <li className="bigfix">Add progress charts
                        <ul>
                            <li>Want to see progression and breakdown of notable changes over weeks</li>
                        </ul>
                    </li>

                    <li className="smallfix">Rename title and doc title / fix icon</li>
                    <li className="medfix">Switch placeholders in lift catalogue and display properly</li>
                    <li className="medfix">Add to database
                        <ul>
                            <li>Programs</li>
                        </ul>
                    
                    </li>


               </ul>
            </div>

            <div className="col">
            <ul>


                <li className="bigfix">Make UI UX better
                    <ul>
                        <li>Round corners</li>
                        <li>Animations</li>
                        <li>Layout</li>
                        <li>Color palette</li>
                    </ul></li>
                <li className="optional">user login
                    <ul>
                        <li className="optional">Save status and user settings/custom workouts</li>
                    </ul>
                </li>

                <li className="optional">Have multiple routines at once add/remove (e.g. run and lift)</li>
                <li className="optional">Remove Home page (redundant, progress?)</li>


                </ul>
            </div>
            
           
        </div>
    )
}