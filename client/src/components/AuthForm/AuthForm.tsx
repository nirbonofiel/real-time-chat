import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import "./styles.css";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { handleLogin, handleRegister } from "../../api/apiActions";


type AuthFormProps = {
    pageName: string;
}

const AuthForm: React.FC<AuthFormProps> = ({ pageName }) => {
    const {isRegister,setIsRegister,saveToken}: any = useAuth();
    const [open, setOpen] = useState(true);


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSetAuthType = () => {
        setIsRegister(!isRegister);
    }

    const handleSubmitAuth = async(formJson:any) => {
        let data = null;
        if(isRegister){
           data = await handleLogin('/auth/login',formJson)
        }else{
            data = await handleRegister('/auth/register',formJson);
        }
        saveToken(data);
        handleClose();
    } 

    return (
        <Dialog
            open={open}
            maxWidth={'xs'}
            onClose={handleClose}
            PaperProps={{
                component: 'form',
                onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const formJson = Object.fromEntries((formData as any).entries());
                    handleSubmitAuth(formJson);
                    console.log('data: ', formJson)
                },
            }}
        >
            <DialogTitle textAlign={'center'}>{pageName} to Chat</DialogTitle>
            <DialogContent >
                <TextField name="username" type="text" placeholder="Username" fullWidth className="authInput"/>
                <TextField name="password" type="password" placeholder="Password" fullWidth className="authInput"/>
            </DialogContent>
            <DialogActions style={{flexDirection:'column'}}>
                <Button type="submit" variant="contained" style={{marginBottom:8,width:'94%'}}>{pageName}</Button>
            {isRegister ? <div> Don't have an account? <Button variant="text" onClick={handleSetAuthType}>Signup now</Button></div> : 
                <div> Already have an account? <Button variant="text" onClick={handleSetAuthType}>Login now</Button></div>
            }
            </DialogActions>
        </Dialog>
    )
}

export default AuthForm;