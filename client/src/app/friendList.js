import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { socket } from "./socket.js";

export default function FriendList({
    navIconClick,
    visible,
    handlePendingUsers,
    friendClick,
}) {
    const [clickedPending, setClickedPending] = useState(false);
    const [friends, setFriends] = useState([]);
    const [pending, setPending] = useState([]);
    console.log(friends);
    useEffect(() => {
        /*    async function getFriendships() {
            const response = await fetch("/api/friendships");
            const ParsedJSON = await response.json();
            setFriends(ParsedJSON.filter((user) => user.accepted));
            setPending(ParsedJSON.filter((user) => !user.accepted));
        }
        getFriendships(); */

        socket.emit("testEvent");

        socket.on("getFriendListStatus", (data) => {
            setFriends(data.filter((user) => user.accepted));
            setPending(data.filter((user) => !user.accepted));
        });
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

    function handleClickOnChatIcon(friendId) {
        navIconClick();
        friendClick(friendId);
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
                                            handleClickOnChatIcon(
                                                friend.user_id
                                            )
                                        }
                                    >
                                        💬
                                    </p>
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
        handlePendingUsers(newPending);
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
        handlePendingUsers(newPending);
    }

    function renderFriendActive() {
        return (
            <div className="AorB">
                <h2 className="activeList" onClick={handleFriendClick}>
                    Friend list
                </h2>
                <h2 onClick={handlePendingClick}>Pending</h2>
            </div>
        );
    }

    function renderPendingActive() {
        return (
            <div className="AorB">
                <h2 onClick={handleFriendClick}>Friend list</h2>
                <h2 className="activeList" onClick={handlePendingClick}>
                    Pending
                </h2>
            </div>
        );
    }

    return (
        <motion.div className={visible ? "friendList visible" : "friendList"}>
            {clickedPending ? renderPendingActive() : renderFriendActive()}

            {!clickedPending ? renderFriendList() : renderPendingList()}
        </motion.div>
    );
}
