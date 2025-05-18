import cors from 'cors';
import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import authRouter from './controllers/authController';
import userRouter from './controllers/userController';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from './helper/jwtAuth';
import dotenv from 'dotenv';

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET || '1234';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

app.use(cors());
app.use(express.json())

app.use('/auth',authRouter);
app.use('/users',userRouter);

app.get('/protected', authenticateJWT, (req:any, res) => {
    res.json({ message: `Hello, ${req.user.username}!`, userId: req.user.id });
  });

function getRoomName(userId1:string, userId2:string) {
return [userId1, userId2].sort().join('-');
}

io.use((socket: any,next)=>{
    const token = socket.handshake.auth.authToken;
    console.log('token',token);
    if(token){
        jwt.verify(token,JWT_SECRET, (err:any ,user: any)=>{
            if(err){
                console.log('tokenError:',err);
                return next(new Error('Authentication error'));
            }
            socket.user = user;
            next();
        });
    }else {
        next(new Error('Authentication error'));
    }
}).on('connection',(socket:any)=> {
    console.log('a user connected');
    const user = socket.user.username;
    socket.on('joinRoom', ({ room,otherUsername }:any) => {
        console.log(user)
        const allowedRoom = getRoomName(user, otherUsername);
        if (room === allowedRoom) {
          socket.join(room);
        }
        // Optionally, notify others in the room
        // io.to(room).emit('userJoined', { userId: socket.id });
      });

    socket.on('leaveRoom', ({ room }:any) => {
        socket.leave(room);
    });

    socket.on('message',(data:any)=>{
        const timestamp = new Date().toISOString();
        const { room } = data;
        io.to(room).emit('message',{...data,user,timestamp});
    })

    socket.on('typing',() =>{
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