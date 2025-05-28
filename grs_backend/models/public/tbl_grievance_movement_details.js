const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_connection');
const CaraInternalDepartment = require('../masters/tbl_cara_internal_departments');
const GrievanceDetail = require('./tbl_grievance_details_global');
const UserDetail = require('../masters/tbl_users_details');

const GrievanceMovementDetail = sequelize().define('tbl_grievance_movement_details', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    grievance_token: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
            model: GrievanceDetail,
            key: 'grievance_token'
        }
    },
    dept_move_from: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CaraInternalDepartment,
            key: 'dept_id'
        }
    },
    dept_move_to: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: CaraInternalDepartment,
            key: 'dept_id'
        }
    },
    mover_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: UserDetail,
            key: 'user_id'
        }
    },
    movement_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    mover_ip: {
        type: DataTypes.INET,
        allowNull: false
    }
}, {
    tableName: 'tbl_grievance_movement_details',
    timestamps: false,
    schema: 'public'
});

module.exports = GrievanceMovementDetail;
