import cors from 'cors';
import express from 'express';
import http from 'http';
import {Server} from 'socket.io';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

app.use(cors());

io.on('connection',(socket)=> {
    console.log('a user connected');

    socket.on('message',(data: {message: string, user: string, avatarUrl: string})=>{
        const timestamp = new Date().toISOString();
        io.emit('message',{...data,timestamp});
    })

    socket.on('typing',(user:string) =>{
        socket.broadcast.emit('typing',user);
    })

    socket.on('stopTyping',() =>{
        socket.broadcast.emit('stopTyping');
    })

    socket.on('disconnect', ()=> {
        console.log('user disconnect');
    })
})

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});