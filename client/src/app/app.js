import ProfilePicture from "./profilePicture";
import { useState, useEffect } from "react";
import Modal from "./modal";
import Profile from "./profile";
import FindUsers from "./find-users";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import OtherUser from "./otherUser";
import Chat from "./chat";

export default function App() {
    // states
    const [showModal, setShowModal] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        async function getUser() {
            const response = await fetch("/api/users/me");
            const parsedJSON = await response.json();
            setUser({ ...parsedJSON });
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

    function updateImg(img_url) {
        // console.log("IMAGE", img_url);
        setUser({ ...user, img_url });
        setShowModal(false); // why not rerender page?
    }

    function onBioUpdate(bio) {
        // console.log("NEW BIO", bio);
        setUser({ ...user, bio });
    }

    function renderProfile() {
        return (
            <>
                {showModal && (
                    <Modal updateImg={updateImg} onClick={onModalClose} />
                )}
                <Profile
                    onClick={onModalOpen}
                    onBioUpdate={onBioUpdate}
                    user={user}
                />
            </>
        );
    }

    // creating template
    return (
        <div className="app">
            <BrowserRouter>
                <header>
                    <div className="navLogoContainer">
                        <img className="logo" src="/Podchat_Logo.png" />
                    </div>

                    <ProfilePicture user={user} />
                </header>
                <Routes>
                    <Route path="/users" element={<FindUsers />}></Route>
                    <Route exact path="/" element={renderProfile()}></Route>
                    <Route
                        path="/user/:otherUserId"
                        element={<OtherUser />}
                    ></Route>
                    <Route path="/chat" element={<Chat />}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
