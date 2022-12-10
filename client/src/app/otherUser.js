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
            <section className="profile">
                <div className="infoContainer">
                    <img className="profileImg" src={user.img_url}></img>
                    <div className="profileInfos">
                        <p className="name">
                            {user.first_name} {user.last_name}
                        </p>
                        <p className="accountType">Personal Account</p>
                    </div>
                </div>
                <div className="bioContainer">
                    <p>{user.bio}</p>
                </div>
            </section>
            <FriendshipButton user_id={otherUserId} />
        </>
    );
}
