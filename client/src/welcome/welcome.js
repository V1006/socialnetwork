import Register from "./register";
import Login from "./login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import LoginPw from "./loginPw";

export default function Welcome() {
    const [clickedOnNext, setClickedOnNext] = useState(false);
    const [email, setEmail] = useState("");
    // const [noEmail, setNoEmail] = useState(false);

    function getEmail(email) {
        setEmail(email);
    }

    function handleOnClick() {
        setClickedOnNext(!clickedOnNext);
    }

    return (
        <BrowserRouter>
            <img className="landing-logo" src="/Podchat_Logo.png"></img>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route
                    path="/"
                    element={
                        !clickedOnNext ? (
                            <Login
                                emailFunc={getEmail}
                                onClick={handleOnClick}
                            />
                        ) : (
                            <LoginPw email={email} onClick={handleOnClick} />
                        )
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
