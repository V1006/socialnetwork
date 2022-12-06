/* import { Link } from "react-router-dom"; */
import { useState } from "react";
import { motion } from "framer-motion";

export default function login({ onClick, emailFunc }) {
    const [noEmail, setNoEmail] = useState(false);
    const [animation, setAnimation] = useState(false);

    function handleSubmitEmail(event) {
        event.preventDefault();
        async function checkEmail(email) {
            const response = await fetch(`/api/email?q=${email}`);
            const ParsedJSON = await response.json();
            if (!ParsedJSON) {
                setNoEmail(true);
                return;
            }
            emailFunc(email);
            setAnimation(!animation);
            setTimeout(onClick, 125);
        }
        checkEmail(event.target.email.value);
    }

    function handleClick() {
        setAnimation(true);
        setTimeout(() => {
            window.location = "/register";
        }, 200);
    }

    return (
        <section className="registerSection">
            <motion.div
                animate={{
                    x: animation ? -70 : 0,
                    opacity: animation ? 0 : 1,
                }}
                transition={{ type: "tween", duration: 0.25 }}
                className="form_background"
            >
                <div className="topPartLogin">
                    <h1 className="loginText">Login</h1>
                    <p>
                        New user?{" "}
                        <motion.a
                            onClick={handleClick}
                            className="signUpText"
                            href="#"
                        >
                            Sign up
                        </motion.a>
                    </p>
                    <form
                        onSubmit={handleSubmitEmail}
                        // onChange={handleEmail}
                        className="userData"
                    >
                        <div className="group">
                            <input type="email" name="email" required />
                            <span className="highlight"></span>
                            <span className="bar"></span>
                            <label>E-mail</label>
                        </div>
                        <button className="continueButton">Next</button>
                    </form>
                    {noEmail && (
                        <p className="error">No matching email found</p>
                    )}
                </div>
                <img src="/gg_ap_fb.png"></img>
            </motion.div>
        </section>
    );
}
