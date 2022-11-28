import {Link} from "react-router-dom";

export default function login() {

    async function handleClick() {
        /* const response = await fetch("/api/pete") */
        const response = await fetch("/api/pete", {
            method: "Post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: "terst",
                password: "testpw"
            })
        });

        const data = await response.json()
    }
    return (
    <section className="loginSection">
        <h1>Login</h1>
        <form className="userData">
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
            <p>
                <Link to="/register">Sign up</Link>
            </p>
        </section>
        )
}