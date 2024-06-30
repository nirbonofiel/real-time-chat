import {Request,Response} from 'express';
import jwt from 'jsonwebtoken';
import { SERCRETKEY } from '../constants/jwtConst';


export const authenticateJWT = (req:any,res:Response,next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('token: ', token);
    if(!token){
        return res.sendStatus(403);
    }

    jwt.verify(token, SERCRETKEY, (err:any, user: any)=> {
        if(err){
            res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};