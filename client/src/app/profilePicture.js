import { Link } from "react-router-dom";
import FriendList from "./friendList";
import { useState, useEffect } from "react";

export default function ProfilePicture({ user, friendClick }) {
    const [visible, setVisible] = useState(false);
    const [pendingDot, setPendingDot] = useState(false);

    useEffect(() => {}, []);

    function handlePendingUsers(users) {
        if (users.length) {
            setPendingDot(true);
            return;
        }
        setPendingDot(false);
    }

    if (!user.img_url) {
        user.img_url = "https://via.placeholder.com/100x100";
    }

    function handleOnIconClick() {
        setVisible(!visible);
    }

    return (
        <div className="navProfile">
            <ul className="navUL">
                <li>
                    {!pendingDot ? (
                        <img
                            className="friendsLogo"
                            onClick={handleOnIconClick}
                            src="/Friend_Requests.png"
                        ></img>
                    ) : (
                        <img
                            className="friendsLogo"
                            onClick={handleOnIconClick}
                            src="/Friend Requests_dot2.png"
                        ></img>
                    )}

                    <FriendList
                        navIconClick={handleOnIconClick}
                        friendClick={friendClick}
                        handlePendingUsers={handlePendingUsers}
                        visible={visible}
                    />
                </li>
                <li className="divider">|</li>
                <li>
                    <a href="/">Home</a>
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
