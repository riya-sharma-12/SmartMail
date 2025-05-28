const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_connection');

const GrievanceStakeholders = sequelize().define(
    'tbl_grievance_stakeholders',
    {
        stakeholder_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        stakeholder_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        schema: 'master',
        tableName: 'tbl_grievance_stakeholders',
    }
);

module.exports = GrievanceStakeholders;