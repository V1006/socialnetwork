import { createRoot } from "react-dom/client";
import Welcome from "./welcome";

const root = createRoot(document.querySelector("main"));

root.render(<Welcome />);

/* fetch('/user/id.json')
    .then(response => response.json())
    .then(data => {
        if (!data.userId) {
            root.render(<Welcome />);
        } else {
            root.render(<h1>user loged in already</h1>);
        }
    })
; */

