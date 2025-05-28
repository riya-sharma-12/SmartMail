const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_connection');
const CaraDept = require('../masters/tbl_cara_internal_departments');

const GrievanceEntry = sequelize().define(
    'tbl_grievance_details_global',
    {
        grievance_token: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        applicant_email_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        grievance_mail_subject: {
            type: DataTypes.STRING,
        },
        grievance_mail_body: {
            type: DataTypes.STRING,
        },
        attached_docx: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        applicant_name: {
            type: DataTypes.STRING,
        },
        applicant_gender: {
            type: DataTypes.STRING,
        },
        applicant_regno: {
            type: DataTypes.STRING,
        },
        applicant_district_code: {
            type: DataTypes.STRING,
        },
        applicant_state_code: {
            type: DataTypes.STRING,
        },
        applicant_country_code: {
            type: DataTypes.STRING,
        },
        grievance_category: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        grievance_type: {
            type: DataTypes.INTEGER,
            defaultValue: 1,
        },
        grievance_subject_id: {
            type: DataTypes.INTEGER,
        },
        grievance_dept_code: {
            type: DataTypes.STRING,
            references: {
                model: 'tbl_cara_internal_departments',
                key: 'dept_id'
            }
        },
        grievance_entry_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        grievance_status: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        internal_remark: {
            type: DataTypes.STRING,
        },
        ip: {
            type: DataTypes.INET,
            allowNull: false
        },
        creater_id: {
            type: DataTypes.STRING,
        },
        grievance_from: {
            type: DataTypes.INTEGER,
        },
        mail_message_id: {
            type: DataTypes.STRING
        },
        mail_ref_id: {
            type: DataTypes.STRING
        },
        attached_docs: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        }
    },
    {
        timestamps: false,
        schema: 'public',
        tableName: 'tbl_grievance_details_global',
    }
);

GrievanceEntry.belongsTo(CaraDept, {
    foreignKey: 'grievance_dept_code',
    targetKey: 'dept_id',
    as: 'caraDepts'
});

module.exports = GrievanceEntry;