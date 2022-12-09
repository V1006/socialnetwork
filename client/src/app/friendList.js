import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function FriendList({ visible, handlePendingUsers }) {
    const [clickedPending, setClickedPending] = useState(false);
    const [friends, setFriends] = useState([]);
    const [pending, setPending] = useState([]);
    useEffect(() => {
        async function getFriendships() {
            const response = await fetch("/api/friendships");
            const ParsedJSON = await response.json();
            setFriends(ParsedJSON.filter((user) => user.accepted));
            setPending(ParsedJSON.filter((user) => !user.accepted));
        }
        getFriendships();
    }, []);

    useEffect(() => {
        handlePendingUsers(pending);
    }, [pending]);

    function handleFriendClick() {
        setClickedPending(false);
    }

    function handlePendingClick() {
        setClickedPending(true);
    }

    function renderFriendList() {
        return (
            <section className="friendsListContainer">
                <ul>
                    {friends.map((friend) => (
                        <li key={friend.user_id}>
                            <div className="friendInsideListContainer">
                                <img src={friend.img_url} />
                                <p>
                                    {friend.first_name} {friend.last_name}
                                </p>
                                <div className="acceptOrDeny">
                                    <p
                                        onClick={() =>
                                            handelDeleteClick(friend.user_id)
                                        }
                                    >
                                        ✖
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        );
    }

    async function handelDeleteClick(user_id) {
        await fetch(`/api/friendships/${user_id}`, {
            method: "POST",
        });
        const newFriendList = friends.filter(
            (user) => user.user_id !== user_id
        );
        setFriends(newFriendList);
    }

    function renderPendingList() {
        return (
            <section className="friendsListContainer">
                <ul>
                    {pending.map((pending) => (
                        <li key={pending.user_id}>
                            <div className="friendInsideListContainer">
                                <img src={pending.img_url} />
                                <p>
                                    {pending.first_name} {pending.last_name}
                                </p>
                                <div className="acceptOrDeny">
                                    <p
                                        onClick={() =>
                                            handelAcceptClick(pending.user_id)
                                        }
                                    >
                                        ✔
                                    </p>
                                    <p
                                        onClick={() =>
                                            handelDeclineClick(pending.user_id)
                                        }
                                    >
                                        ❌
                                    </p>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
        );
    }

    async function handelAcceptClick(user_id) {
        await fetch(`/api/friendships/${user_id}`, {
            method: "POST",
        });

        // adding it to the friends array pending.find() by id ...friends , new friend
        const newFriend = pending.find((user) => user.user_id === user_id);
        setFriends([...friends, newFriend]);
        // remove from pending by filtering it by id != -> new array without the accepted user for pending
        const newPending = pending.filter((user) => user.user_id !== user_id);
        setPending(newPending);
    }

    // handle decline friends request
    // same logic ending  friendship but with new route on server

    // NEED TO FIX THAT IT IS STILL PENDING WHEN RENDERING THE USER AND STILL APPEARS IN PENDING LIST
    // check db the get friendship api should not find the friendship anymore und should therefore change the state on the individual profile
    async function handelDeclineClick(user_id) {
        await fetch(`/api/friendships/decline/${user_id}`, {
            method: "POST",
        });

        const newPending = pending.filter((user) => user.user_id !== user_id);
        setPending(newPending);
    }

    return (
        <motion.div className={visible ? "friendList visible" : "friendList"}>
            <div className="AorB">
                <h2 onClick={handleFriendClick}>Friend list</h2>
                <h2 onClick={handlePendingClick}>Pending</h2>
            </div>
            {!clickedPending ? renderFriendList() : renderPendingList()}
        </motion.div>
    );
}
