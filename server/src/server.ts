import cors from 'cors';
import express from 'express';
import http from 'http';
import {Server} from 'socket.io';
import authRouter from './controllers/authController';
import jwt from 'jsonwebtoken';
import { authenticateJWT } from './helper/jwtAuth';
import { SERCRETKEY } from './constants/jwtConst';

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

app.get('/protected', authenticateJWT, (req:any, res) => {
    res.json({ message: `Hello, ${req.user.username}!`, userId: req.user.id });
  });

io.use((socket: any,next)=>{
    const token = socket.handshake.auth.token;
    if(token){
        jwt.verify(token,SERCRETKEY, (err:any ,user: any)=>{
            if(err){
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

    socket.on('message',(data: {message: string, avatarUrl: string})=>{
        const timestamp = new Date().toISOString();
        const user = socket.user.username;
        io.emit('message',{...data,user,timestamp});
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