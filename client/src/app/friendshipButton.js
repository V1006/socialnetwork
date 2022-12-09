import { useState, useEffect } from "react";

export default function FriendshipButton({ user_id }) {
    const [status, setStatus] = useState(null);
    const [clickAble, setClickAble] = useState(false);
    const [outgoing, setOutgoing] = useState(false);

    useEffect(() => {
        async function getFriendship() {
            const response = await fetch(`/api/friendships/${user_id}`);
            const ParsedJSON = await response.json();
            if (ParsedJSON.status === "NO_FRIENDSHIP") {
                setClickAble(true);
                setStatus("Friend request");
            } else if (ParsedJSON.status === "OUTGOING_FRIENDSHIP") {
                setOutgoing(true);
                setClickAble(true);
                setStatus("Pending friend");
            }
        }
        getFriendship();
    }, [user_id]);

    async function handleOnClick() {
        const response = await fetch(`/api/friendships/${user_id}`, {
            method: "POST",
        });
        const ParsedJSON = await response.json();
        if (ParsedJSON) {
            setStatus("Pending friend");
            setOutgoing(true);
        }
    }

    return (
        <>
            {clickAble ? (
                !outgoing ? (
                    <button onClick={handleOnClick} className="continueButton">
                        {status}
                    </button>
                ) : (
                    <button className="continueButton disabled">
                        {status}
                    </button>
                )
            ) : (
                <div></div>
            )}
        </>
    );
}
