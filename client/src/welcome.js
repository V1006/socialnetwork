import {useState} from "react"
import Register from "./register"
import Login from "./login"
import {BrowserRouter, Routes, Route, Link} from "react-router-dom";

export default function Welcome() {
    return (
    <BrowserRouter>
        <div>
            <Routes>
                <Route path ="/register" element={<Register />} />
                <Route path ="/login" element={<Login />} />
            </Routes>
        </div>
    </BrowserRouter>
    )
}