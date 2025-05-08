import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const sequelize = new Sequelize(process.env.DB_NAME || 'database', process.env.DB_USER || 'root', process.env.DB_PASSWORD || 'root', {
  host: process.env.DB_HOST || 'localhost',
  dialect: 'mysql',
  logging: false, // Set to true for SQL query logging
}
);
export default sequelize;