import Bio from "./bio";

export default function Profile({ user, onBioUpdate, onClick }) {
    return (
        <section className="profile">
            <img
                onClick={onClick}
                className="profileImg"
                src={user.img_url}
            ></img>
            <div className="bioContainer">
                <h1>
                    {user.first_name} {user.last_name}
                </h1>
                <Bio onBioUpdate={onBioUpdate} user={user} />
            </div>
        </section>
    );
}
