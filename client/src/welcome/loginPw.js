import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function LoginPw({ onClick, email }) {
    const [NoMatch, setNoMatch] = useState(false);
    const [previewImg, setPreviewImg] = useState(null);

    useEffect(() => {
        async function getPreviewImg() {
            const response = await fetch(`/api/preview?q=${email}`);
            const ParsedJSON = await response.json();
            setPreviewImg(!ParsedJSON ? null : ParsedJSON.img_url);
        }
        getPreviewImg();
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                password: event.target.password.value,
            }),
        });
        const data = await response.json();
        console.log(data);
        if (!data.success) {
            setNoMatch(true);
            return;
        }
        window.location.href = "/";
    }
    return (
        <section className="registerSection">
            <motion.div
                animate={{
                    x: 0,
                    opacity: 1,
                }}
                initial={{ opacity: 0, x: 70 }}
                transition={{ type: "tween", duration: 0.25 }}
                className="form_background"
            >
                <div className="topPartLogin">
                    <h1 className="loginText">Enter password</h1>
                    <div className="userInfoBox">
                        <img src={previewImg}></img>
                        <div className="signUpTextAccountType">
                            <p className="signUpText">{email}</p>
                            <p className="accountType">Personal Account</p>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} className="userData">
                        <div className="group">
                            <input type="password" name="password" required />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>Password</label>
                        </div>
                        <button className="continueButton">Login</button>
                    </form>
                    {NoMatch && (
                        <p className="error">Email or password is wrong</p>
                    )}
                </div>
                <div className="changeUserSection">
                    <p>Change user?</p>
                    <p onClick={onClick} className="signUpText">
                        Click here
                    </p>
                </div>
            </motion.div>
        </section>
    );
}
