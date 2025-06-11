// models/Organization.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // adjust path as needed

const Organization = sequelize.define(
  'Organization',
  {
    org_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    gmail_app_password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: 'organizations',
    schema: 'public',
    underscored: true,
    timestamps: false,
  }
);

/* ---------- associations (hooked up later) ---------- */
Organization.associate = ({ Reply }) => {
  Organization.hasMany(Reply, {
    foreignKey: 'org_id',
    sourceKey: 'org_id',
    as: 'replies',
  });
};

module.exports = Organization;
