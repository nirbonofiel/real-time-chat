import User from "../models/User";
import { Op } from "sequelize";

export class UserService {
    static async retrieveUsers(req:{ user: { userId: number } }, res: any) {
        try {
            const users = await User.findAll({
                where: {
                    id: { [Op.ne]: req.user.userId }
            }
        });
        res.json(users);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving users' });
        }
    }
}

