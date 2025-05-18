import express from "express";
import { UserService } from "../services/userService";
import { authenticateJWT } from "../helper/jwtAuth";

const router = express.Router();


router.get('/users',authenticateJWT,UserService.retrieveUsers);

export default router;