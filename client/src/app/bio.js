import { useState } from "react";

export default function Bio({ user, onBioUpdate }) {
    const [isEditing, setEditing] = useState(false);

    function onEditButtonClick() {
        setEditing(!isEditing);
    }

    async function onSubmit(event) {
        const newBio = event.target.bio.value;
        event.preventDefault();
        const response = await fetch("api/users/me/bio", {
            method: "PUT",
            body: JSON.stringify({ bio: newBio }),
            headers: { "Content-type": "application/json" },
        });

        const ParsedJSON = await response.json();

        if (!ParsedJSON) {
            return;
        }

        setEditing(false);
        onBioUpdate(ParsedJSON.bio);
    }

    function renderForm() {
        return (
            <form className="bioForm" onSubmit={onSubmit}>
                <textarea name="bio" defaultValue={user.bio} />
                <button>Save Bio</button>
            </form>
        );
    }

    const buttonLabel = isEditing ? "Cancel" : "Edit bio";

    return (
        <>
            {isEditing ? renderForm() : <p className="bio">{user.bio}</p>}
            <button className="editBioButton" onClick={onEditButtonClick}>
                {buttonLabel}
            </button>
        </>
    );
}
