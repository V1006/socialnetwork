import io from "socket.io-client";
import { useState, useEffect } from "react";

let socket;

// lazy initialise pattern!
const connect = () => {
    if (!socket) {
        socket = io.connect();
    }
    return socket;
};

const disconnect = () => {
    socket.disconnect();
    socket = null;
};

export default function Chat() {
    const [name, setName] = useState("");
    useEffect(() => {
        socket = connect();
        socket.on("test_event", (ev) => {
            setName(ev);
            console.log(ev);
        });

        return () => {
            disconnect();
        };
    }, []);
    return (
        <>
            <div>{name}</div>
        </>
    );
}
