import { useState, useEffect, useRef } from "react";
import { socket } from "./socket.js";

export default function Chat({ friendId, resetFriend }) {
    const [messages, setMessages] = useState([]);
    const listRef = useRef(null);
    const [arrowClicked, setArrowClicked] = useState(false);
    const [user_id, setUser_id] = useState(null);

    console.log(messages);

    useEffect(() => {
        socket.emit("chatMounted");

        socket.on("getChat", (chatMsg, user_id) => {
            setMessages(chatMsg);
            setUser_id(user_id);
        });

        socket.emit("add user");

        socket.on("private message", (data) => {
            setMessages((messages) => [...messages, data]);
        });
    }, []);

    useEffect(() => {
        if (friendId) {
            setArrowClicked(true);
            socket.emit("clickedFriendID", friendId);
            socket.on("getChat", (chatMsg) => {
                setMessages(chatMsg);
            });
        }
    }, [friendId]);

    useEffect(() => {
        const lastChatMessage = listRef.current.lastChild;
        if (lastChatMessage) {
            lastChatMessage.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    function handleKeyDown(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const data = { to: friendId, msg: event.target.value };
            socket.emit("private message", data);

            event.target.value = "";
        }
    }

    function handleArrowClick() {
        resetFriend(null);
        if (!messages.length) {
            console.log("msg empty chat l55");
            return;
        }
        if (messages[0].sender_id == user_id) {
            resetFriend(messages[0].recipient_id);
            setArrowClicked(!arrowClicked);
        } else {
            resetFriend(messages[0].sender_id);
            setArrowClicked(!arrowClicked);
        }
    }

    function renderMe(obj) {
        return (
            <li className="chat-message" key={obj.id}>
                <img src={obj.img_url} className="chat-message-avatar"></img>
                <p className="chat-message-text">{obj.msg}</p>
            </li>
        );
    }

    function renderThem(obj) {
        return (
            <li className="chat-message notMe" key={obj.id}>
                <p className="chat-message-text NotMeBubble">{obj.msg}</p>
                <img src={obj.img_url} className="chat-message-avatar"></img>
            </li>
        );
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
                        {messages.map((obj) =>
                            user_id === obj.sender_id
                                ? renderMe(obj)
                                : renderThem(obj)
                        )}
                    </ul>
                    <textarea
                        className="chat-input"
                        onKeyDown={handleKeyDown}
                    ></textarea>
                </div>
            </section>
        </>
    );
}
