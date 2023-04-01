import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
const app = express();

app.use(cors);
const httpServer = createServer();
const PORT = 9000;
const io = new Server(httpServer, {
  cors: {
		origin: "https://heuristic.vercel.app/",
		methods: [ "GET", "POST" ]
	}
});
io.on("connection", (socket) => {
	socket.emit("me", socket.id)

	socket.on("disconnect", () => {
		socket.broadcast.emit("callEnded")
	})

	socket.on("callUser", (data) => {
		io.to(data.userToCall).emit("callUser", { signal: data.signalData, from: data.from, name: data.name })
	})

	socket.on("answerCall", (data) => {
		io.to(data.to).emit("callAccepted", data.signal)
	})
});


httpServer.listen(PORT,() => console.log("server is running on port "+PORT+' ⚡'));


