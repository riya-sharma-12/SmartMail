const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_connection');
const UserLevel = require('./tbl_user_levels');
const CaraInternalDepartment = require('./tbl_cara_internal_departments');
const { caraInternalDeptsModel } = require('..');

const UserDetail = sequelize().define('tbl_users_details', {
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    user_level: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: UserLevel,
            key: 'level_id'
        }
    },
    user_dept: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: CaraInternalDepartment,
            key: 'dept_id'
        }
    },
    user_hashpassword: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    user_creater_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    user_created_at: {
        type: DataTypes.DATE,
        allowNull: false
    },
    creater_ip: {
        type: DataTypes.INET,
        allowNull: false
    }
}, {
    tableName: 'tbl_users_details',
    timestamps: false,
    schema: 'master'
});

UserDetail.belongsTo(UserLevel, {
    foreignKey: 'user_level',
    targetKey: 'level_id',
    as: 'userLevel'
});

UserDetail.belongsTo(CaraInternalDepartment, {
    foreignKey: 'user_dept',
    targetKey: 'dept_id',
    as: 'caraInternalDepts'
});


module.exports = UserDetail;
