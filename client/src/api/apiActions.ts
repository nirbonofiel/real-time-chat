import { AuthType } from "../types"
import axiosInstance from "./axiosInstance";

export const handleRegister = async(path:string,auth:AuthType) => {
    try{
        const response = await axiosInstance.post(path,auth);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log('Error registering user');
    }
}

export const handleLogin = async(path:string,auth:AuthType) => {
    try{
        const response = await axiosInstance.post(path,auth);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log('Error registering user');
    }
}