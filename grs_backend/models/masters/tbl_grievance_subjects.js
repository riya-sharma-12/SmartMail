const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_connection');

const GrievanceSubject = sequelize().define('tbl_grievance_subjects', {
    subject_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    subject_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    subject_category: {
        type: DataTypes.CHAR,
        allowNull: false
    }
}, {
    tableName: 'tbl_grievance_subjects',
    timestamps: false,
    schema: 'master'
});

module.exports = GrievanceSubject;
