import { AuthType } from "../types"
import axiosInstance from "./axiosInstance";

export const handleRegister = async(path:string,auth:AuthType) => {
    try{
        const response = await axiosInstance.post(path,auth);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const handleLogin = async(path:string,auth:AuthType) => {
    try{
        const response = await axiosInstance.post(path,auth);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export const retrieveUsers = async(path:string, token: string) => {
    try{
        const response = await axiosInstance.get(path, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

