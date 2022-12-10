import { useState, useEffect } from "react";

export default function FindUsers() {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");
    // const [noResult, setNoResult] = useState(false);

    useEffect(() => {
        async function getUsers() {
            const response = await fetch(`/api/users?q=${query}`);
            const ParsedJSON = await response.json();
            if (!ParsedJSON) {
                setUsers([]);
                return;
            }
            setUsers(ParsedJSON);
            // console.log(ParsedJSON);
            // setNoResult(!ParsedJSON.length);
        }
        getUsers();
    }, [query]);

    function handleOnChange(event) {
        setQuery(event.target.value);
    }

    function handleClickingOnUser(id) {
        window.location = `/user/${id}`;
        setUsers([]);
    }

    return (
        <section className="findUsers">
            <div className="search-bar">
                <select>
                    <option value="user">User</option>
                    <option value="podcast">Podcast</option>
                </select>
                <div className="inputAndLi">
                    <input
                        type="text"
                        placeholder="..search"
                        onChange={handleOnChange}
                    ></input>
                    <ul className="foundUserContainer">
                        {users.map((user) => (
                            <li className="foundUser" key={user.id}>
                                <img
                                    src={user.img_url}
                                    onClick={() =>
                                        handleClickingOnUser(user.id)
                                    }
                                />

                                <p>{user.first_name}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}
