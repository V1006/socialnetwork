import { Link } from "react-router-dom";
import FriendList from "./friendList";
// import { useState } from "react";

export default function ProfilePicture({ user }) {
    // const [clicked, setClicked] = useState(false);

    if (!user.img_url) {
        user.img_url = "https://via.placeholder.com/100x100";
    }

    function handleOnIconClick() {}

    return (
        <div className="navProfile">
            <ul>
                <li>
                    <img
                        className="friendsLogo"
                        onClick={handleOnIconClick}
                        src="/Friend_Requests.png"
                    ></img>
                    <FriendList />
                </li>
                <li className="divider">|</li>
                <li>
                    <a href="#">Home</a>
                </li>
                <li className="divider">|</li>
                <li>
                    <a href="/api/logout">Logout</a>
                </li>
                <li className="divider">|</li>
            </ul>

            <Link to="/">
                <img
                    className="profile-picture"
                    src={user.img_url}
                    alt={`${user.first_name} ${user.last_name}`}
                ></img>
            </Link>
        </div>
    );
}
