import { Link } from "react-router-dom";
// import { useState } from "react";

export default function login({ onClick, email }) {
    // const [noEmail, setNoEmail] = useState(false);

    function handleEmail(event) {
        event.preventDefault();
        const emailValue = event.target.value;
        // NEED TO FIX LOGIC TO CHECK IF THE USER TYPED IN A EMAIL THAT EXISTS
        /*         async function checkEmail(email) {
            await fetch(`/api/preview?q=${email}`);
            const response = await fetch(`/api/preview?q=${email}`);
            const ParsedJSON = await response.json();
            if (!ParsedJSON) {
                setNoEmail(!noEmail);
                return;
            }
        }
        checkEmail(emailValue); */
        email(emailValue);
    }

    return (
        <section className="registerSection">
            <div className="form_background">
                <h1 className="loginText">Login</h1>
                <p>
                    New user?{" "}
                    <Link className="signUpText" to="/">
                        Sign up
                    </Link>
                </p>
                <form onChange={handleEmail} className="userData">
                    <div className="group">
                        <input type="email" name="email" required />
                        <span className="highlight"></span>
                        <span className="bar"></span>
                        <label>E-mail</label>
                    </div>
                    <button onClick={onClick} className="continueButton">
                        Next
                    </button>
                </form>
                {/* {NoMatch && <p className="error">Email or password is wrong</p>} */}
                <img src="/gg_ap_fb.png"></img>
            </div>
        </section>
    );
}
