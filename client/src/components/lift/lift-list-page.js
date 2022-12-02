import React, {useEffect} from "react";

import { useState } from "react";
import { useNavigate } from "react-router";
import LiftTable from "./lift-table";

export default function GetLifts() {
    const navigate = useNavigate();
    return (
        <div>
                        <h2 className="secondary-title">Known Exercises</h2>
                        <LiftTable onBack={() => navigate("/")}
        />
        </div>
       
    )
}