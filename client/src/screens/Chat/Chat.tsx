import React, { useEffect, useRef, useState } from "react";
import io, { Socket } from 'socket.io-client';
import MessageInputs from "../../components/MessageInputs/MessageInputs";
import MessageList from "../../components/MessageList/MessageList";
import { MessageType } from "../../types";
import { useAuth } from "../../context/AuthContext";
import UserList from "../../components/UserList/UserList";
import "./styles.css";


const Chat: React.FC = () => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const [typing, setTyping] = useState<string | null>(null);
    const [recipient, setRecipinet] = useState<string>();
    const {authToken, isTokenExpired, removeToken, username}:any = useAuth();
    const socketRef = useRef<Socket | null >(null);
    const [currentRoom, setCurrentRoom] = useState<string | null>(null);

    useEffect(() => {
        if(isTokenExpired()){
            removeToken();
        }
        if(authToken && currentRoom && username){
            socketRef.current = io('http://localhost:5000',{
                auth: {authToken}
            });
            socketRef.current.emit('joinRoom', { room: currentRoom, otherUsername: recipient });

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
                socketRef.current?.emit('leaveRoom', { room: currentRoom });
                socketRef.current?.off('message');
                socketRef.current?.off('typing');
                socketRef.current?.off('stopTyping');
                socketRef.current?.disconnect();
            };
        }
    }, [authToken, username, currentRoom]);

    const switchRoom = (recipient:string) => {
        const newRoom = [username, recipient].sort().join('-');

        setCurrentRoom(newRoom);
        setMessages([]); // Clear messages or load from backend

        // Optionally, fetch message history for newRoom here
      };

    const sendMessage = (message: string) => {
        if (message.trim() && currentRoom) {
            console.log('socket',socketRef.current);
            const avatarUrl = 'http://example.com/avatar.jpg';
            socketRef.current?.emit('message', {
                message,
                avatarUrl,
                room: currentRoom,
                to: recipient
            });
        }
    }

    const handleRecipientChange = (recipient: string) => {
        setRecipinet(recipient);
        switchRoom(recipient);
    }

    const handleTyping = (isTyping: boolean) => {
        if (isTyping) {
            socketRef.current?.emit('typing', { room: currentRoom });
        } else {
            socketRef.current?.emit('stopTyping', { room: currentRoom });
        }
    };

    return (
        <div>
            {typing && <div>{typing} is typing...</div>}
            <div className="chatContainer">

            <MessageList messages={messages} />
            <UserList handleRecipientChange={handleRecipientChange} recipient={recipient}/>
            </div>
            <MessageInputs sendMessage={sendMessage} handleTyping={handleTyping} />
        </div>

    );
};

export default Chat;