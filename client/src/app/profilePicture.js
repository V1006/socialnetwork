export default function ProfilePicture({ onClick, user }) {
    if (!user.imgURL) {
        user.imgURL = "https://via.placeholder.com/100x100";
    }
    return (
        <img
            onClick={onClick}
            className="profile-picture"
            src={user.imgURL}
            alt={`${user.first_name} ${user.last_name}`}
        ></img>
    );
}
