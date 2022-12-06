import Bio from "./bio";

export default function Profile({ user, onBioUpdate, onClick }) {
    return (
        <section className="profile">
            <h1> Hey, {user.first_name}</h1>
            <div className="infoContainer">
                <img
                    onClick={onClick}
                    className="profileImg"
                    src={user.img_url}
                ></img>
                <div className="profileInfos">
                    <p className="name">
                        {user.first_name} {user.last_name}
                    </p>
                    <p className="accountType">Personal Account</p>
                </div>
            </div>
            <div className="bioContainer">
                <Bio onBioUpdate={onBioUpdate} user={user} />
            </div>
        </section>
    );
}
