import { useState, useEffect } from "react";

export default function FriendshipButton({ user_id }) {
    const [status, setStatus] = useState(null);
    const [clickAble, setClickAble] = useState(true);

    useEffect(() => {
        async function getFriendship() {
            const response = await fetch(`/api/friendships/${user_id}`);
            const ParsedJSON = await response.json();
            setStatus(ParsedJSON);
        }
        getFriendship();
    }, [user_id]);

    async function handleOnClick() {
        const response = await fetch(`/api/friendships/${user_id}`, {
            method: "POST",
        });
        const ParsedJSON = await response.json();
        if (ParsedJSON === "OUTGOING_FRIENDSHIP") {
            setClickAble(false);
        }
        setStatus(ParsedJSON);
    }

    return (
        <>
            {clickAble ? (
                <button onClick={handleOnClick} className="continueButton">
                    {status}
                </button>
            ) : (
                <button disabled className="continueButton">
                    {status}
                </button>
            )}
        </>
    );
}
