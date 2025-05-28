const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_connection');
const GrievanceModel = require("./tbl_grievances");
const GrievanceResponses = sequelize().define(
    'tbl_grievance_responses',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        grievance_token: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'public.tbl_grievance_details_global',
                key: 'grievance_token',
            },
        },
        grievance_sub_token_no: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        responser_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        responser_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        response_type: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        response: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        upload_doc_path: {
            type: DataTypes.STRING,
            defaultValue: 'NA',
        },
        responser_ip: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        response_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        timestamps: false,
        schema: 'public',
        tableName: 'tbl_grievance_responses',
    }
);

// GrievanceResponses.belongsTo(GrievanceModel, {
//     foreignKey: {
//         name: 'fk_grievance_sub_token_no',
//         field: ['grievance_token', 'grievance_sub_token_no'],
//     },
//     targetKey: ['grievance_token', 'grievance_sub_token_no'],
// });


module.exports = GrievanceResponses;