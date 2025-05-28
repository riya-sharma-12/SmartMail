const Sequelize = require('sequelize');
const {env} = process;

const connectDB = () => {
    const db = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASS, {
        host: env.DB_HOST,
        dialect: env.DB_DIALECT,
        pool: {
          max: 5,
          min: 0,
          acquire: 30000,
          idle: 10000
        },
      });
    return db;      
}
module.exports = connectDB;
