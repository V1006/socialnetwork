import { Link } from "react-router-dom";
import { useState } from "react";

export default function login() {
    const [NoMatch, setNoMatch] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: event.target.email.value,
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
            <h1>Login</h1>
            <form onSubmit={handleSubmit} className="userData">
                <div className="group">
                    <input type="email" name="email" required />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label>E-mail</label>
                </div>
                <div className="group">
                    <input type="password" name="password" required />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label>Password</label>
                </div>
                <button>Login</button>
            </form>
            {NoMatch && <p className="error">Email or password is wrong</p>}
            <p>
                <Link to="/">Sign up</Link>
            </p>
        </section>
    );
}
