const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db_connection');
const State = require('./tbl_states'); // Import State model if available

const District = sequelize().define('tbl_districts', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    state_lgd_code: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: State,
            key: 'lgd_code'
        }
    },
    district_lgd_code: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    district_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'tbl_districts',
    timestamps: false,
    schema: 'master'
});

module.exports = District;
