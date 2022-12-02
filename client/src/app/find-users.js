import { useState, useEffect } from "react";

export default function FindUsers() {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");
    const [noResult, setNoResult] = useState(false);

    useEffect(() => {
        async function getUsers() {
            const response = await fetch(`/api/users?q=${query}`);
            const ParsedJSON = await response.json();
            setUsers(ParsedJSON);
            // console.log(ParsedJSON);
            setNoResult(!ParsedJSON.length);
        }
        getUsers();
    }, [query]);

    function handleOnChange(event) {
        setQuery(event.target.value);
    }

    return (
        <section className="findUsers">
            <h1>Find User</h1>
            <input
                type="text"
                placeholder="..search"
                onChange={handleOnChange}
            ></input>
            {noResult && <p className="error">No user found</p>}
            <div className="foundUserContainer">
                {users.map((user) => (
                    <div className="foundUser" key={user.id}>
                        <img src={user.img_url} />
                        <h1>{user.first_name}</h1>
                    </div>
                ))}
            </div>
        </section>
    );
}
