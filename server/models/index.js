const sequelize = require('../config/database');
const Term = require('./Term');
const Course = require('./Course');

const db = {
    sequelize,
    Term,
    Course
};

module.exports = db;
