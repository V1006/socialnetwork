import { createRoot } from "react-dom/client";
import Welcome from "./welcome/welcome";
import App from "./app/app";
import { connect } from "./app/socket.js";

const root = createRoot(document.querySelector("main"));
try {
    fetch("/api/users/me")
        .then((response) => response.json())
        .then((data) => {
            if (!data) {
                root.render(<Welcome />);
            } else {
                connect();
                root.render(<App />);
            }
        });
} catch (error) {
    console.log(error);
}
