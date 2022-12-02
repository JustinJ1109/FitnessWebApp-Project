import React, { useEffect } from "react";
import { useNavigate } from "react-router";

export default function Rec() {

    const navigate = useNavigate();

    useEffect(() => {
        async function doIt() {
            fetch(`http://localhost:5000/record`)
            .then((res) => {
                console.log(res)
                res.json()
                .then((body) => {
                    console.log(body)
                    if (body.redirectURL) {
                        navigate(body.redirectURL)
                    }
                })
            })
            .catch((err) => {
                console.log(err)
            })
        }

        doIt()
    },[])

    return (
        <div>Rec</div>
    )
}