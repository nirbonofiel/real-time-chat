import { createContext, useContext, useState } from "react";
import { AuthReturn } from "../types";

const AuthContext = createContext({});

export const AuthProvider = ({children}:any) => {
    const [authToken,setAuthToken] = useState(localStorage.getItem('jwt')|| null);
    const [username,setUsername] = useState<string>();
    const [isRegister,setIsRegister] = useState(true);

    const saveToken = (data:AuthReturn) => {
        console.log('data',data);
        setAuthToken(data.token);
        setUsername(data.username);
        localStorage.setItem('jwt',data.token);
    };

    const checkTokenExpairy = () =>{
        let dt = new Date();
        dt.setHours(dt.getHours() + 2);
        const dtn = new Date();
        if(dt > dtn){
            console.log('dtn is smaller: ',dtn);
            return false
        }
        return true;
    };

    const removeToken = () => {
        setAuthToken(null);
        localStorage.removeItem('jwt');
    };

    return (
        <AuthContext.Provider value={{authToken,saveToken,isRegister,setIsRegister,username}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);