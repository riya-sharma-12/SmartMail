const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_connection');
const GrievanceModel = require('./tbl_grievance');

const GrievanceResponse = sequelize().define(
    'tbl_grievance_response',
    {
        grievance_token: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            references: {
                model: GrievanceModel,
                key: 'grievance_token',
            },
        },
        grievance_sub_token_no: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        grievance_subject_code: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'master.tbl_grievance_subjects', // Correct the reference to include the schema
                key: 'subject_id',
            },
        },
        grievance: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        grievance_uploaded_doc_path: {
            type: DataTypes.STRING,
            defaultValue: 'NA',
        },
        grievance_status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        grievance_resp: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        grievance_resp_byuser: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        grievance_resp_byuser_type: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'master.tbl_grievance_stakeholders',
                key: 'stakeholder_id',
            },
        },
        user_ip: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        responser_ip: {
            type: DataTypes.STRING,
            defaultValue: "NA",
        },
        grievance_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        grievance_resp_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        timestamps: false,
        schema: 'public',
        tableName: 'tbl_grievance_response',
    }
);

// GrievanceResponse.belongsTo(GrievanceModel, {
//     foreignKey: 'grievance_token',
//     targetKey: 'grievance_token',
// });


module.exports = GrievanceResponse;