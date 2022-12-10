import io from "socket.io-client";
import { useState, useEffect, useRef } from "react";

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
    const [messages, setMessages] = useState([]);
    const listRef = useRef(null);
    const [arrowClicked, setArrowClicked] = useState(false);

    useEffect(() => {
        socket = connect();

        socket.on("getChat", (chatMsg) => {
            setMessages(chatMsg);
        });

        socket.on("newMessage", (data) => {
            console.log(data);
            setMessages((messages) => [...messages, data]);
        });

        return () => {
            disconnect();
        };
    }, []);

    useEffect(() => {
        const lastChatMessage = listRef.current.lastChild;
        if (lastChatMessage) {
            lastChatMessage.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            socket.emit("sendMsg", event.target.value);

            event.target.value = "";
        }
    }

    function handleArrowClick() {
        setArrowClicked(!arrowClicked);
    }
    return (
        <>
            <section
                className={
                    !arrowClicked ? "chatSection" : "chatSection onScreen"
                }
            >
                {!arrowClicked ? (
                    <div onClick={handleArrowClick} className="arrow">
                        ▲
                    </div>
                ) : (
                    <div onClick={handleArrowClick} className="arrow">
                        ▼
                    </div>
                )}

                <div className="chat-window">
                    <ul className="chat-messages" ref={listRef}>
                        {messages.map((obj) => (
                            <li className="chat-message" key={obj.id}>
                                <img
                                    src={obj.img_url}
                                    className="chat-message-avatar"
                                ></img>
                                <p className="chat-message-text">
                                    {obj.first_name}: {obj.msg}
                                </p>
                            </li>
                        ))}
                    </ul>
                    <textarea onKeyDown={handleKeyDown}></textarea>
                </div>
            </section>
        </>
    );
}
