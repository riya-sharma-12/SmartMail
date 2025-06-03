// models/email.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');   // ← your Sequelize instance

const Email = sequelize.define(
  'Email',
  {
    resp_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },

    org_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'organizations',   // table name in DB
        key: 'org_id',
      },
    },

    from_email: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    subject: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    email_message_id: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    body: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    category: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    status: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },

    received_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName:  'emails',
    schema:     'public',
    underscored:true,   // keeps snake_case columns
    timestamps: false,  // we already have created_at
  }
);

/* ---------- associations (hooked up later) ---------- */
Email.associate = ({ Organization }) => {
  Email.belongsTo(Organization, {
    foreignKey: 'org_id',
    targetKey:  'org_id',
    as:         'organization',
  });
};

module.exports = Email;   // ← export the model itself
