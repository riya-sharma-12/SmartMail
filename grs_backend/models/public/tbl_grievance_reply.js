const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_connection');
//model
const GrievanceEntry = require('./tbl_grievance_details_global');
const UserDetail = require('../masters/tbl_users_details');

const GrievanceReply = sequelize().define('tbl_grievance_reply', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email_token: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'tbl_grievance_details_global',
            key: 'email_token'
        }
    },
    responcer_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: 'tbl_users_details',
            key: 'user_id'
        }
    },
    cc_ids: {
        type: DataTypes.STRING,
        allowNull: true
    },
    reply_body: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reply_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    grievance_reply_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    responcer_ip: {
        type: DataTypes.INET,
        allowNull: false
    }
}, {
    tableName: 'tbl_grievance_reply',
    timestamps: false,
    schema: 'public'
});

GrievanceReply.belongsTo(GrievanceEntry, {
    foreignKey: 'email_token',
    targetKey: 'email_token',
    as: 'grievanceEntry'
});

GrievanceReply.belongsTo(UserDetail, {
    foreignKey: 'responcer_id',
    targetKey: 'user_id',
    as: 'userDetail'
});


module.exports = GrievanceReply;
