import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from 'socket.io-client';
import MessageInputs from "../../components/MessageInputs/MessageInputs";
import MessageList from "../../components/MessageList/MessageList";
import { MessageType } from "../../types";
import { useAuth } from "../../context/AuthContext";


const Chat: React.FC = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [typing, setTyping] = useState<string | null>(null);
    const {authToken}:any = useAuth();
    const socketRef = useRef<Socket | null >(null);

    useEffect(() => {
        if(authToken){
            socketRef.current = io('http://localhost:5000',{
                auth: {authToken}
            });
            socketRef.current.on('message', (data: MessageType) => {
                setMessages((prevMessages) => [...prevMessages, data]);
            })
            
            socketRef.current.on('typing', (user: string) => {
                setTyping(user);
            })
            
            socketRef.current.on('stopTyping', () => {
                setTyping(null);
            })
            
            return () => {
                socketRef.current?.off('message');
                socketRef.current?.off('typing');
                socketRef.current?.off('stopTyping');
                socketRef.current?.disconnect();
            };
        }
    }, []);

    const sendMessage = (message: string) => {
        if (message.trim()) {
            console.log('socket',socketRef.current);
            const user = message
            const avatarUrl = 'http://example.com/avatar.jpg';
            socketRef.current?.emit('message', {message,user,avatarUrl});
        }
    }

    const handleTyping = (isTyping: boolean) => {
        isTyping ? socketRef.current?.emit('typing', 'Nir') : socketRef.current?.emit('stopTyping');
    }

    return (
        <div>
            {typing && <div>{typing} is typing...</div>}
            <MessageList messages={messages} />
            <MessageInputs sendMessage={sendMessage} handleTyping={handleTyping} />
        </div>
    );
};

export default Chat;