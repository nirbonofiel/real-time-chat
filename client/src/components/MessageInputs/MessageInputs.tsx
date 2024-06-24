import { IconButton, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import "./styles.css";

type MessageInputProps = {
    sendMessage: (message: string) => void,
    handleTyping: (isTyping: boolean) => void
}

const MessageInputs: React.FC<MessageInputProps> = ({ sendMessage, handleTyping }) => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        const timeoutId = setTimeout(() => handleTyping(false), 500);
        return () => clearTimeout(timeoutId);
    }, [message]);

    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage(message);
            setMessage('');
            handleTyping(false);
        }
    }


    return (
        <div className="messageInputsContainer">
            <TextField id="outlined-basic" variant="outlined"
            value={message}
            onChange={(e) => {
                setMessage(e.target.value);
                handleTyping(true);
            }}
            placeholder="Message"
            fullWidth
            className="msgField"
            onKeyUp={(e) => e.key === 'Enter' ? handleSendMessage() : null} />
            <IconButton style={{color:"#3b4a54", marginLeft:0}} onClick={handleSendMessage} disabled={message === ''} size="large">
                <SendIcon />
            </IconButton>
        </div>
    );
};

export default MessageInputs;