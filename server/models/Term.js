const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Term = sequelize.define('Term', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

module.exports = Term;
