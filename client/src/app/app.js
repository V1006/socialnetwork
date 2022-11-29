import ProfilePicture from "./profilePicture";
import { useState, useEffect } from "react";
import Modal from "./modal";

export default function App() {
    // states
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function getUser() {
            const response = await fetch("/api/users/me");
            const parsedJSON = await response.json();
            setUser(parsedJSON);
        }
        getUser();
    }, []);

    if (!user) {
        return;
    }
    // event listeners
    function onModalOpen() {
        setShowModal(true);
    }

    function onModalClose() {
        setShowModal(false);
    }

    // creating template
    return (
        <div className="app">
            <header>
                <p>Home</p>
                <ProfilePicture user={user} onClick={onModalOpen} />
            </header>
            {showModal && <Modal onClick={onModalClose} />}
        </div>
    );
}
