const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_connection');

const CaraInternalDepartment = sequelize().define('tbl_cara_internal_departments', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    dept_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    dept_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_by: {
        type: DataTypes.STRING,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    dept_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    creater_ip_address: {
        type: DataTypes.INET,
        allowNull: false
    }
}, {
    tableName: 'tbl_cara_internal_departments',
    timestamps: false,
    schema: 'master'
});

module.exports = CaraInternalDepartment;
