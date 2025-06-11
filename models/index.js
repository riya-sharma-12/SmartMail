const Email = require('./email');
const Reply = require('./reply');
const Organization = require('./Organization');

// Setup associations

// Email ↔ Reply
Email.hasOne(Reply, { foreignKey: 'resp_id', sourceKey: 'resp_id' });
Reply.belongsTo(Email, { foreignKey: 'resp_id', targetKey: 'resp_id' });

// Organization ↔ Reply
Organization.hasMany(Reply, { foreignKey: 'org_id', sourceKey: 'org_id' });
Reply.belongsTo(Organization, { foreignKey: 'org_id', targetKey: 'org_id' });

// Optionally: Email ↔ Organization (if needed in your logic)
// Email.belongsTo(Organization, { foreignKey: 'org_id', targetKey: 'org_id' });

module.exports = {
  Email,
  Reply,
  Organization,
};
