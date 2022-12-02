import { Link } from "react-router-dom";

export default function ProfilePicture({ user }) {
    if (!user.img_url) {
        user.img_url = "https://via.placeholder.com/100x100";
    }
    return (
        <div className="navProfile">
            <p>Hello {user.first_name},</p>
            <a href="/api/logout">Logout</a>
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
