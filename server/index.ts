import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import mongoose from "mongoose";
import messageModel from "./models/messageModel";

export const mongoDB =
  "mongodb+srv://m001-student:m001-mongodb-basics@cluster0.kp6eshx.mongodb.net/?retryWrites=true&w=majority";
const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected:${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    messageModel.find().then((result) => {
      socket.emit("messages__history", result);
    });

    console.log(`User with name:${data.username,data.room}`);
  });
  socket.on("join_room", (data) => {
    socket.join(data);
    messageModel.find({}, { author: "$author" }).then((result) => {
      socket.emit("users__history", result);
      console.log(result);
    });
  });

  socket.on("send_message", (data) => {
    const msg = new messageModel(data);
    msg.save().then(() => {
      console.log("message saved", data);
      
    });
    socket.to(data.room).emit("receive_message", data);
    console.log(data.room);
    console.log(data);
  });
  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
  });
});
server.listen(3001, () => {
  console.log(`Server is running`);
});
mongoose
  .connect(mongoDB, {})
  .then(() => {
    console.log("connected to mongo");
  })
  .catch((err) => console.log(err));
