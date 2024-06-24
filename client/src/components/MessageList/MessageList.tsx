import React from "react";
import { MessageType } from "../../types";
import "./styles.css";
import Message from "../Message/Message";

type MessageListProps = {
    messages: MessageType[]
}

const MessageList: React.FC<MessageListProps> = ({messages}) => {

    return (
        <div className="messagesListContainer">
            {messages.map((msg, index) => (
               <Message message={msg} key={index}/>
            ))}
        </div>
    );
};

export default MessageList;