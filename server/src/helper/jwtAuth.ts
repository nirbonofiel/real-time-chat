import {Request,Response} from 'express';
import jwt from 'jsonwebtoken';


const JWT_SECRET = process.env.JWT_SECRET || '1234';


export const authenticateJWT = (req:any,res:Response,next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('token: ', token);
    if(!token){
        return res.sendStatus(403);
    }

    jwt.verify(token, JWT_SECRET, (err:any, user: any)=> {
        if(err){
            res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};