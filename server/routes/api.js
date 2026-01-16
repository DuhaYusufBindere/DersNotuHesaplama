const express = require('express');
const router = express.Router();
const { Course, Term } = require('../models');

// Helper function to calculate letter grade
function calculateLetterAndPoints(score, avg, stdDev, manualLetter = null) {
    let letter = manualLetter;
    let points = 0.0;

    // Point mapping
    const pointMap = {
        'AA': 4.0, 'BA': 3.5, 'BB': 3.0, 'CB': 2.5,
        'CC': 2.0, 'DC': 1.5, 'DD': 1.0, 'FD': 0.5, 'FF': 0.0
    };

    if (letter) {
        // Manual Entry Mode
        points = pointMap[letter] || 0.0;
        return { letter, points };
    }

    // Calculation Mode
    if (stdDev === 0 || score === null || avg === null) return { letter: 'N/A', points: 0 };

    const z = (score - avg) / stdDev;

    if (z > 1.5) { letter = 'AA'; }
    else if (z > 1.0) { letter = 'BA'; }
    else if (z > 0.5) { letter = 'BB'; }
    else if (z > 0.0) { letter = 'CB'; }
    else if (z > -0.5) { letter = 'CC'; }
    else if (z > -1.0) { letter = 'DC'; }
    else if (z > -1.5) { letter = 'DD'; }
    else { letter = 'FF'; }

    points = pointMap[letter] || 0.0;

    return { letter, points };
}

// Get All Terms with Calculations
router.get('/terms', async (req, res) => {
    try {
        const terms = await Term.findAll({
            include: [Course]
        });

        const termData = terms.map(term => {
            const courses = term.Courses;
            let totalCredit = 0;
            let totalPoints = 0;

            const courseData = courses.map(course => {
                const { letter, points } = calculateLetterAndPoints(course.score, course.class_avg, course.std_dev, course.letter_grade);
                totalCredit += course.credit;
                totalPoints += (points * course.credit);
                return {
                    ...course.toJSON(),
                    grade_points: points
                };
            });

            const gpa = totalCredit > 0 ? (totalPoints / totalCredit).toFixed(2) : 0;

            return {
                id: term.id,
                name: term.name,
                gpa,
                courses: courseData
            };
        });

        res.json(termData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create Term
router.post('/terms', async (req, res) => {
    try {
        const term = await Term.create({ name: req.body.name });
        res.json(term);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add Course
router.post('/courses', async (req, res) => {
    try {
        const { term_id, name, credit, score, class_avg, std_dev, manual_letter } = req.body;

        let finalLetter = manual_letter;

        // If no manual letter is provided, calculate it
        if (!finalLetter) {
            const { letter } = calculateLetterAndPoints(score, class_avg, std_dev);
            finalLetter = letter;
        }

        const course = await Course.create({
            term_id,
            name,
            credit,
            score: score || null,
            class_avg: class_avg || null,
            std_dev: std_dev || null,
            letter_grade: finalLetter
        });
        res.json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
