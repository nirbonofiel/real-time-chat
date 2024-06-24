import React from "react";
import moment from "moment";
import { MessageType } from "../../types";
import { Avatar, Card, Paper } from "@mui/material";
import "./styles.css";

type MessageProps = {
    message: MessageType
}

const Message: React.FC<MessageProps> = ({message}) => {

    return (
        <div className="messageContainer">
                <Avatar alt={message.user} src={message.avatarUrl} style={{ marginRight: 5 }} />
                <Card className="messageCard userMessage" elevation={3} >
                    <div>{message.message}</div>
                    <div className="messageTime">{moment(message.timestamp).format('H:mm')}</div>
                </Card>
        </div>
    );
};

export default Message;