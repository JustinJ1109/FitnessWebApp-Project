import React, { useEffect } from "react";

let color_pop_me = require("../../db/_color_map.json")


export default function PopulateColorThemes() {

    useEffect(() => {
        function pop() {
            color_pop_me.map(async (item) => {
                console.log(item)

                let response = await fetch(`http://localhost:5000/color/add`, {
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
    }, [])

    return (
        <div> Color Pop Page</div>
    )
}