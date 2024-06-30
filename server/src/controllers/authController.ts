import express from "express";
import { AuthService } from "../services/authService";
import { body } from "express-validator";

const router = express.Router();

const registerValidation = [body('username').isLength({min:2}),body('password').isLength({min:5})]

router.post('/register',registerValidation,AuthService.register);
router.post('/login',AuthService.login);

export default router; 