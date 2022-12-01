import ProfilePicture from "./profilePicture";
import { useState, useEffect } from "react";
import Modal from "./modal";
import Profile from "./profile";
import FindUsers from "./find-users";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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

    function goToProfile() {
        console.log("goooo");
        window.location.href = "/";
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
            <header>
                <img className="logo" src="/Podchat_Logo.png" />
                <ProfilePicture user={user} onClick={goToProfile} />
            </header>
            <BrowserRouter>
                <Routes>
                    <Route path="/users" element={<FindUsers />}></Route>
                    <Route path="/" element={renderProfile()}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}
