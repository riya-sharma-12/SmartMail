// In a central file where you import your models, e.g. models/index.js or app.js  
const Email = require('./email');
const Reply = require('./reply');

// Define associations
Email.hasMany(Reply, { foreignKey: 'resp_id', sourceKey: 'resp_id' });
Reply.belongsTo(Email, { foreignKey: 'resp_id', targetKey: 'resp_id' });

module.exports = { Email, Reply };
