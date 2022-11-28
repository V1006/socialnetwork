import {Link} from "react-router-dom";

export default function Register() {

    async function handleClick(event) {
        console.log(event.target)
        event.preventDefault();
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                first_name: event.target.first_name.value,
                last_name: event.target.last_name.value,
                email: event.target.email.value,
                password: event.target.password.value
            })
        });

        const data = await response.json()
    }
    return (
    <section className="registerSection">
        <h1>Register Here</h1>
        <form className="userData">
                <div className="group">
                    <input type="text" name="first_name" required />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label>First Name</label>
                </div>
                <div className="group">
                    <input type="text" name="last_name" required />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label>Last Name</label>
                </div>
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
                <button onClick={handleClick}>Register</button>
        </form>
        <p>
            <Link to="/login">Already signed up?</Link>
        </p>
        </section>
        )
}