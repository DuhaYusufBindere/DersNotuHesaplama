const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Term = require('./Term');

const Course = sequelize.define('Course', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    credit: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    class_avg: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    std_dev: {
        type: DataTypes.FLOAT,
        allowNull: true
    },
    letter_grade: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

Course.belongsTo(Term, { foreignKey: 'term_id' });
Term.hasMany(Course, { foreignKey: 'term_id' });

module.exports = Course;
