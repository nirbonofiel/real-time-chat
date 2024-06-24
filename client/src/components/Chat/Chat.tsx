import React, { useEffect, useState } from "react";
import io from 'socket.io-client';
import MessageInputs from "../MessageInputs/MessageInputs";
import MessageList from "../MessageList/MessageList";
import { MessageType } from "../../types";

const socket = io('http://localhost:5000');

const Chat: React.FC = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [typing, setTyping] = useState<string | null>(null);

    useEffect(() => {
        socket.on('message', (data: MessageType) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        })

        socket.on('typing', (user: string) => {
            setTyping(user);
        })

        socket.on('stopTyping', () => {
            setTyping(null);
        })

        return () => {
            socket.off('message');
            socket.off('typing');
            socket.off('stopTyping');
        };
    }, []);

    const sendMessage = (message: string) => {
        if (message.trim()) {
            const user = 'Nir'
            const avatarUrl = 'http://example.com/avatar.jpg';
            socket.emit('message', {message,user,avatarUrl});
        }
    }

    const handleTyping = (isTyping: boolean) => {
        isTyping ? socket.emit('typing', 'Nir') : socket.emit('stopTyping');
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