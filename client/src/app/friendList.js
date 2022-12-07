import { useState, useEffect } from "react";

export default function FriendList() {
    const [friends, setFriends] = useState([]);
    // const [pending, setPending] = useState([]);
    useEffect(() => {
        async function getFriendships() {
            const response = await fetch("/api/friendships");
            const ParsedJSON = await response.json();
            console.log("FRIENDS 1", friends);
            setFriends(ParsedJSON.filter((user) => user.accepted));
            console.log("FRIENDS 2", friends);
            console.log(ParsedJSON);
        }
        getFriendships();
    }, []);

    return (
        <div className="friendList">
            <section className="friendListContainer">
                <ul>
                    {friends.map((friend) => (
                        <li key={friend.user_id}>{friend.fist_name}</li>
                    ))}
                </ul>
            </section>
            <section className="pending"></section>
        </div>
    );
}
