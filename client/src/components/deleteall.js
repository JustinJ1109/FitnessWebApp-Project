import React, { useEffect, useState } from "react";


export default function Delete() {

    const [deleteit, setDelete] = useState();

    useEffect (() => {
        async function deleteAll() {
            const response = await fetch(`http://localhost:5000/deleteall`);

            if (!response.ok) {
                const message = `An error occurred: ${response.statusText}`;
                window.alert(message);
                return;
            }

            const deleteit = await response.json();
            setDelete(deleteit)
        }

        deleteAll();

        return;
    }, [deleteit]);

    return (
        <div>
            Deleted
        </div>
    )

}