import Register from "./register";
import Login from "./login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
