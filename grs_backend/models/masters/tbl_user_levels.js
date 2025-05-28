const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_connection');

const UserLevel = sequelize().define('tbl_user_levels', {
    level_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    level_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'tbl_user_levels',
    timestamps: false,
    schema: 'master'
});

module.exports = UserLevel;
