import React from "react";
import moment from "moment";
import { MessageType } from "../../types";
import { Avatar, Card } from "@mui/material";
import "./styles.css";
import { useAuth } from "../../context/AuthContext";

type MessageProps = {
    message: MessageType
}

const Message: React.FC<MessageProps> = ({message}) => {
    const {username}: any = useAuth();

    const isMe = () => {
        return message.user === username;
    }

    return (
        <div className="messageContainer" style={!isMe()?{flexDirection: 'row-reverse'}: undefined}>
                <Avatar alt={message.user} src={message.avatarUrl} style={isMe()?{ marginRight: 5 }: {marginLeft: 5}} />
                <Card className={`${isMe() ? "userMessage" : ""} messageCard`} elevation={3} >
                    <div>{message.message}</div>
                    <div className="messageTime" >{moment(message.timestamp).format('H:mm')} </div>
                </Card>
        </div>
    );
};

export default Message;