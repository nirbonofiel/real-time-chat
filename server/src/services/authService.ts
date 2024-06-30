import {Request,Response} from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { SERCRETKEY } from '../constants/jwtConst';
import { User } from '../types';

let users: User[] = [];
export class AuthService {

    static async register(req:Request,res:Response){
        const error = validationResult(req);
        if(!error.isEmpty()){
            return res.status(400).json({errors: error.array()});
        }
        console.log('users: ', users);
        const {username, password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        if(users.find(u=>u.username === username)) {
            return res.status(400).json({message: 'User already exsists'});
        }

        users.push({username:username, password: hashedPassword, id: Date.now()});
        res.status(201).json({message: 'User registered successfully',users: users})

    } 

    static async login(req:Request,res:Response){
        const {username, password} = req.body;

        const user = users.find(u=>u.username === username);
        if(!user){
            return res.status(400).json({message: 'Invalid username or password'});
        }

        const isPasswordVaild = await bcrypt.compare(password, user.password);
        if(!isPasswordVaild) {
            return res.status(400).json({message: 'Invalid username or password'})
        }

        const token = jwt.sign({ username, id: user.id}, SERCRETKEY, {expiresIn: '1h'});
        res.json({token:token});
    }
}