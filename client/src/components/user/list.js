import React, { useEffect, useState } from "react";


export default function UserList() {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function getUsers() {

            const response = await fetch(`http://localhost:5000/user`);
            if(!response.ok) {
                console.log("Error getting response")
                return;
            }

            const records = await response.json();

            setUsers(records);
        }

        getUsers();
    }, [users.length])

    return (
        <div>
            {users.map((u) => {
                return (
                    <div>
                    <div>{`${u.name} - ${u.username} - ${u.program}`}</div>
                    </div>
                )
            })}
        </div>
    )
}