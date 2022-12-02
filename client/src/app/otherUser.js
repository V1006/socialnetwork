// import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function OtherUser() {
    // const [user, setUser] = useState(null);
    const { otherUserId } = useParams();
    /* console.log("INSIDE OTHER USER", otherUserId);
    useEffect(() => {
        async function getSingleUser(id) {
            console.log("INSIDE USE EFFECT OF OTHER USER");
            const response = await fetch(`/api/user/${id}`);
            const ParsedJSON = await response.json();
            setUser(ParsedJSON);
        }
        getSingleUser(otherUserId);
    }, []); */

    return (
        /*      <section className="findUsers">
            <div className="foundUserContainer">
                <div className="foundUser">
                    <img src={user.img_url} />
                    <h1>{user.first_name}</h1>
                    <p>{user.bio}</p>
                </div>
            </div>
        </section> */
        <h1>{otherUserId}</h1>
    );
}
