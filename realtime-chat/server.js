const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let onlineUsers = 0;

io.on("connection", (socket) => {

    onlineUsers++;
    io.emit("online count", onlineUsers);

    socket.on("join", (username) => {
        socket.username = username;

        io.emit(
            "system message",
            `${username} sohbete katıldı`
        );
    });

    socket.on("chat message", (data) => {
        io.emit("chat message", data);
    });

    socket.on("disconnect", () => {

        onlineUsers--;

        io.emit("online count", onlineUsers);

        if (socket.username) {
            io.emit(
                "system message",
                `${socket.username} ayrıldı`
            );
        }
    });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});