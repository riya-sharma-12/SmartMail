const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_connection');

const Grievances = sequelize().define(
    'tbl_grievances',
    {
        grievance_token: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            references: {
                model: 'public.tbl_grievance_details_global',
                key: 'grievance_token',
            },
        },
        grievance_sub_token_no: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        grievance: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        grievance_uploaded_doc_path: {
            type: DataTypes.STRING,
            defaultValue: 'NA',
        },
        user_ip: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        grievance_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        schema: 'public',
        tableName: 'tbl_grievances',
    }
);


module.exports = Grievances;