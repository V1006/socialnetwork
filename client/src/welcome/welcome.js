import Register from "./register";
import Login from "./login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import LoginPw from "./loginPw";

export default function Welcome() {
    const [clickedOnNext, setClickedOnNext] = useState(false);
    const [email, setEmail] = useState("");

    function handleOnClick() {
        setClickedOnNext(!clickedOnNext);
    }

    function getEmail(email) {
        setEmail(email);
    }
    return (
        <BrowserRouter>
            <div className="landingPage">
                <img className="landing-logo" src="/Podchat_Logo.png"></img>
                <img
                    className="landing-logo-bg"
                    src="/Vektor-Smartobjekt.png"
                ></img>
                <div className="top_bar"></div>
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route
                        path="/login"
                        element={
                            !clickedOnNext ? (
                                <Login
                                    email={getEmail}
                                    onClick={handleOnClick}
                                />
                            ) : (
                                <LoginPw
                                    email={email}
                                    onClick={handleOnClick}
                                />
                            )
                        }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
