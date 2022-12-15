import { useState, useEffect } from "react";

export default function FindUsers() {
    const [users, setUsers] = useState([]);
    const [query, setQuery] = useState("");
    const [podcast, setPodcast] = useState([]);
    // const [noResult, setNoResult] = useState(false);
    const [defaultOption, setDefaultOption] = useState(true);

    useEffect(() => {
        if (defaultOption) {
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
        }

        if (!defaultOption) {
            async function getPodcast() {
                const response = await fetch(`/api/podcast?q=${query}`);
                const ParsedJSON = await response.json();
                if (!ParsedJSON) {
                    setPodcast([]);
                    return;
                }
                setPodcast(ParsedJSON);
                // console.log(ParsedJSON);
                // setNoResult(!ParsedJSON.length);
            }
            getPodcast();
        }
    }, [query]);

    function handleOnChange(event) {
        setQuery(event.target.value);
    }

    function handleClickingOnUser(id) {
        window.location = `/user/${id}`;
        setUsers([]);
    }

    function handleChangingOptions() {
        setDefaultOption(!defaultOption);
        /* console.log(defaultOption, event.target.value); */
    }

    function handleClickingOnPodcast(podcast_name) {
        window.location = `/podcast/${podcast_name}`;
        setPodcast([]);
    }

    function renderUsers() {
        return (
            <ul className="foundUserContainer">
                {users.map((user) => (
                    <li className="foundUser" key={user.id}>
                        <img
                            src={user.img_url}
                            onClick={() => handleClickingOnUser(user.id)}
                        />

                        <p>{user.first_name}</p>
                    </li>
                ))}
            </ul>
        );
    }

    function renderPodcast() {
        return (
            <ul className="foundUserContainer">
                {podcast.map((pod) => (
                    <li className="foundUser" key={pod.id}>
                        <img
                            src={pod.img_url}
                            onClick={() =>
                                handleClickingOnPodcast(pod.pod_name)
                            }
                        />

                        <p>{pod.pod_display_name}</p>
                    </li>
                ))}
            </ul>
        );
    }

    return (
        <section className="findUsers">
            <div className="search-bar">
                <select onChange={handleChangingOptions}>
                    <option value="user">User</option>
                    <option value="podcast">Podcast</option>
                </select>
                <div className="inputAndLi">
                    <input
                        type="text"
                        placeholder="..search"
                        onChange={handleOnChange}
                    ></input>
                    {defaultOption ? renderUsers() : renderPodcast()}
                </div>
            </div>
        </section>
    );
}
