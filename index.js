const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});
const path = require("path");

const PORT = 3000;

app.get("/", (req, res) => {
  let options = {
    root: path.join(__dirname),
  };
  let fileName = "index.html";
  res.sendFile(fileName, options);
});

let users = 0;

io.on("connection", (socket) => {
  users++;

  // to particular user who connected
  socket.emit("newUser", {
    message: "welcome new user",
  });

  // sending to all clients except user
  socket.broadcast.emit("newUser", {
    message: users + " users connected",
  });

  // to all users, including new users too
  io.sockets.emit("done", "Jai Hind");

  socket.on("disconnect", () => {
    users--;
    socket.broadcast.emit("newUser", {
      message: users + " users connected",
    });
  });
});

http.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});

// socket.emit("newUser", {
//   message: "Welcome budd",
// });
