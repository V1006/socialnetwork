import Register from "./register";
import Login from "./login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <BrowserRouter>
            <div>
                <header>
                    <img className="logo" src="/Podchat_Logo.png" />
                </header>
                <Routes>
                    <Route path="/" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}
