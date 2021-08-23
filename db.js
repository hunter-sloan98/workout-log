const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:3bfb197a357945b197eb10150c76f27a@localhost:5432/workout-log");

module.exports = sequelize;