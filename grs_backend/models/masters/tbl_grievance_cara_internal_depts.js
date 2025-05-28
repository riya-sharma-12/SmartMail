const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_connection');

const GrievanceInternalDepts = sequelize().define(
    'tbl_grievance_cara_internal_depts',
    {
        dept_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        dept_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        schema: 'master',
        tableName: 'tbl_grievance_cara_internal_depts',
    }
);

module.exports = GrievanceInternalDepts;