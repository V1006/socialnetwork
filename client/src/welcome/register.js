import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function Register() {
    async function handleSubmit(event) {
        event.preventDefault();
        const response = await fetch("/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                first_name: event.target.first_name.value,
                last_name: event.target.last_name.value,
                email: event.target.email.value,
                password: event.target.password.value,
            }),
        });
        const data = await response.json();

        if (!data.success) {
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
                <h1>Register Here</h1>
                <form onSubmit={handleSubmit} className="userData">
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
                    <button className="continueButton">Register</button>
                </form>
                <p>
                    <Link to="/" className="signUpText">
                        Already signed up?
                    </Link>
                </p>
            </motion.div>
        </section>
    );
}
