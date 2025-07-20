import { Server } from "socket.io";
//Server from "socket.io" → Used to create a WebSocket server for real-time communication.

import http from "http";
//http → Required to create an HTTP server (since Express alone doesn't create a server).

import express from "express";
//express → A web framework for handling HTTP requests.

const app = express();
//app = express(); → Creates an Express app instance.

const server = http.createServer(app);
//server = http.createServer(app); → Creates an HTTP server using Express.

//Initializing Socket.io
const io = new Server(server, { 
  cors: {
    origin: ["http://localhost:5173"],//5173 ke bad / mene lagaya hai ise hta sakte hai------------------------------
  },
})
/*
Creates a Socket.io server and attaches it to the server.

Handles CORS (Cross-Origin Resource Sharing) to allow WebSocket connections only from http://localhost:5173 (your frontend running on Vite/React).

Note: You can remove / after 5173—it won’t affect anything.   
*/

export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}
/*
 This function returns the socket ID of a given userId stored in userSocketMap.

Useful when sending messages to a specific user in real-time chat apps.
*/

// used to store online users
/* Keeps track of online users using an object.
Ex:userSocketMap = {
  "user123": "socket_abc",
  "user456": "socket_xyz"
};
This means:

user123 is connected with socket_abc

user456 is connected with socket_xyz
*/
const userSocketMap = {}; // {userId: socketId}



io.on("connection", (socket) => {//Triggered when a user connects.
  
  console.log("A user connected", socket.id);//socket.id → Unique ID assigned by Socket.io to the connected user.

  const userId = socket.handshake.query.userId;
  //socket.handshake.query.userId → Retrieves userId from the connection request.

  if (userId) userSocketMap[userId] = socket.id;
  //If userId exists, it is stored in userSocketMap with the corresponding socket.id.

  // io.emit() is used to send events to all the connected clients
  //Sends a list of all online users to all connected clients.
  io.emit("getOnlineUsers", Object.keys(userSocketMap));
  //Object.keys(userSocketMap) → Returns an array of all userIds who are currently online.

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});
/*
riggered when a user disconnects.

Removes the user from userSocketMap so they are no longer considered online.

Broadcasts the updated online users list to all connected clients.

*/

export { io, app, server };
