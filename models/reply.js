const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // adjust path as needed

const Reply = sequelize.define('Reply', {
  llm_reply: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  final_reply: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  replied_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  resp_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'emails', // table name
      key: 'resp_id',
    },
  },
  org_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'organizations', // table name
      key: 'org_id',
    },
  },
  reply_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    allowNull: false,
  },
}, {
  tableName: 'replies',
  timestamps: false, // since no createdAt or updatedAt
});

module.exports = Reply;
