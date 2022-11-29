import React, { useEffect } from "react";

let pop_me = require("../../db/_volume_map.json")

export default function Populate() {

    useEffect(() => {
        function pop() {
            pop_me.map(async (item) => {

                let response = await fetch(`http://localhost:5000/program/add`, {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify(item),
                })
                .catch(error => {
                    // window.alert(error)
                    console.log(error)
                    return
                })

                if (!response.ok) {
                    // window.alert("Error populating")
                    console.log('err populating')

                }
            })

            


        }

        pop();
    })
    console.log(pop_me)

    pop_me.map((p) => {

    })

    return (
        <div> Pop Page</div>
    )
}