const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_connection');

const States = sequelize().define(
    'tbl_states',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true
        },
        lgd_code: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        state_name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: false,
        schema: 'master',
        tableName: 'tbl_states',
    }
);

module.exports = States;