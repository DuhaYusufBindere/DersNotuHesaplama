import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = ({ onAddCourseClick }) => {
    const [terms, setTerms] = useState([]);
    const [overallGPA, setOverallGPA] = useState(0);

    const fetchTerms = async () => {
        try {
            const res = await axios.get('/api/terms');
            setTerms(res.data);
            calculateOverallGPA(res.data);
        } catch (error) {
            console.error("Error fetching terms", error);
        }
    };

    const calculateOverallGPA = (termsData) => {
        let totalPoints = 0;
        let totalCredits = 0;
        termsData.forEach(term => {
            term.courses.forEach(c => {
                totalPoints += c.grade_points * c.credit;
                totalCredits += c.credit;
            });
        });
        setOverallGPA(totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00');
    };

    useEffect(() => {
        fetchTerms();
    }, []);

    const getGradeClass = (grade) => {
        if (!grade) return '';
        return `grade-${grade.toLowerCase()}`;
    };

    return (
        <div>
            <div className="glass-card dashboard-header">
                <div>
                    <h2>Akademik Genel Bakış</h2>
                    <p style={{ color: '#b3b3b3' }}>Hoşgeldiniz</p>
                </div>
                <div className="stat-card">
                    <div style={{ fontSize: '0.9rem', color: '#b3b3b3' }}>GNO</div>
                    <div className="stat-value" style={{ color: Number(overallGPA) > 3.0 ? '#2ecc71' : '#fff' }}>
                        {overallGPA}
                    </div>
                </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3>Dönemler</h3>
                <button className="btn-primary" onClick={onAddCourseClick}>+ Ders Ekle</button>
            </div>

            {terms.map(term => (
                <div key={term.id} className="glass-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <h3>{term.name}</h3>
                        <span className="grade-badge" style={{ fontSize: '1rem', background: 'rgba(255,255,255,0.1)' }}>
                            DNO: {term.gpa}
                        </span>
                    </div>
                    {term.courses.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Ders</th>
                                    <th>Kredi</th>
                                    <th>Not</th>
                                    <th>Ort</th>
                                    <th>Std Sapma</th>
                                    <th>Harf Notu</th>
                                </tr>
                            </thead>
                            <tbody>
                                {term.courses.map(course => (
                                    <tr key={course.id}>
                                        <td>{course.name}</td>
                                        <td>{course.credit}</td>
                                        <td>{course.score}</td>
                                        <td>{course.class_avg}</td>
                                        <td>{course.std_dev}</td>
                                        <td>
                                            <span className={`grade-badge ${getGradeClass(course.letter_grade)}`}>
                                                {course.letter_grade}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p style={{ color: '#b3b3b3', fontStyle: 'italic' }}>Henüz ders eklenmedi.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Dashboard;
