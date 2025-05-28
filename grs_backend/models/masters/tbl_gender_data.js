const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_connection');

const GenderData = sequelize().define('tbl_gender_data', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    gender: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'tbl_gender_data',
    timestamps: false,
    schema: 'master'
});

module.exports = GenderData;
