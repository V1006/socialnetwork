export default function ProfilePicture({ onClick, user }) {
    if (!user.img_url) {
        user.img_url = "https://via.placeholder.com/100x100";
    }
    return (
        <img
            onClick={onClick}
            className="profile-picture"
            src={user.img_url}
            alt={`${user.first_name} ${user.last_name}`}
        ></img>
    );
}
