// sockets setup
import io from "socket.io-client";

export let socket;

// lazy initialise pattern!
export const connect = () => {
    if (!socket) {
        socket = io.connect();
    }
    return socket;
};

/* const disconnect = () => {
    socket.disconnect();
    socket = null;
}; */

// sockets setup end
