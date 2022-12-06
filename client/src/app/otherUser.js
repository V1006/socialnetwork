import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FriendshipButton from "./friendshipButton";

export default function OtherUser() {
    const [user, setUser] = useState({});
    const { otherUserId } = useParams();

    useEffect(() => {
        async function getSingleUser(id) {
            const response = await fetch(`/api/user/${id}`);
            const ParsedJSON = await response.json();
            setUser(ParsedJSON);
        }
        getSingleUser(otherUserId);
    }, []);

    return (
        <>
            <section className="findUsers">
                <div className="foundUserContainer">
                    <div className="foundUser">
                        <img src={user.img_url} />
                        <h1>{user.first_name}</h1>
                        <p>{user.bio}</p>
                    </div>
                </div>
            </section>
            <FriendshipButton user_id={otherUserId} />
        </>
    );
}
