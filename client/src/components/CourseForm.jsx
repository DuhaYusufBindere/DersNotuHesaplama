import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CourseForm = ({ onCancel, onSuccess }) => {
    const [formData, setFormData] = useState({
        term_id: '',
        name: '',
        credit: '',
        score: '',
        class_avg: '',
        std_dev: '',
        manual_letter: ''
    });
    const [terms, setTerms] = useState([]);
    const [newTermName, setNewTermName] = useState('');
    const [isManualMode, setIsManualMode] = useState(false);

    useEffect(() => {
        fetchTerms();
    }, []);

    const fetchTerms = async () => {
        try {
            const res = await axios.get('/api/terms');
            setTerms(res.data);
            if (res.data.length > 0 && !formData.term_id) {
                setFormData(prev => ({ ...prev, term_id: res.data[0].id }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreateTerm = async () => {
        if (!newTermName) return;
        try {
            const res = await axios.post('/api/terms', { name: newTermName });
            setTerms([...terms, res.data]);
            setFormData({ ...formData, term_id: res.data.id });
            setNewTermName('');
        } catch (err) {
            console.error(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Clean up data based on mode
            const dataToSubmit = { ...formData };
            if (isManualMode) {
                dataToSubmit.score = null;
                dataToSubmit.class_avg = null;
                dataToSubmit.std_dev = null;
            } else {
                dataToSubmit.manual_letter = null;
            }

            await axios.post('/api/courses', dataToSubmit);
            onSuccess();
        } catch (err) {
            console.error(err);
            alert('Ders eklenemedi');
        }
    };

    return (
        <div className="glass-card">
            <h2>Yeni Ders Ekle</h2>
            <form onSubmit={handleSubmit}>
                <label>Dönem</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <select name="term_id" value={formData.term_id} onChange={handleChange} style={{ flex: 1 }}>
                        <option value="">Dönem Seç</option>
                        {terms.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                        ))}
                    </select>
                    <div style={{ display: 'flex', gap: '5px', flex: 1 }}>
                        <input
                            placeholder="Yeni Dönem (Örn: Bahar 2024)"
                            value={newTermName}
                            onChange={e => setNewTermName(e.target.value)}
                        />
                        <button type="button" className="btn-primary" onClick={handleCreateTerm}>Ekle</button>
                    </div>
                </div>

                <label>Ders Adı</label>
                <input name="name" placeholder="Örn: Matematik I" required onChange={handleChange} />

                <div className="grid-container" style={{ gridTemplateColumns: 'minmax(100px, 1fr) 2fr' }}>
                    <div>
                        <label>Kredi (AKTS)</label>
                        <input name="credit" type="number" required onChange={handleChange} />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '30px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={isManualMode}
                                onChange={(e) => setIsManualMode(e.target.checked)}
                                style={{ width: '20px', height: '20px', marginRight: '10px' }}
                            />
                            Harf Notunu Elle Seç
                        </label>
                    </div>
                </div>

                {isManualMode ? (
                    <div>
                        <label>Harf Notu</label>
                        <select name="manual_letter" required value={formData.manual_letter} onChange={handleChange}>
                            <option value="">Seçiniz</option>
                            {['AA', 'BA', 'BB', 'CB', 'CC', 'DC', 'DD', 'FD', 'FF'].map(grade => (
                                <option key={grade} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <>
                        <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr' }}>
                            <div>
                                <label>Kredi (AKTS)</label>
                                <input name="credit" type="number" required onChange={handleChange} value={formData.credit} disabled />
                            </div>
                            <div>
                                <label>Notum</label>
                                <input name="score" type="number" step="0.01" required onChange={handleChange} />
                            </div>
                        </div>

                        <div className="grid-container" style={{ gridTemplateColumns: '1fr 1fr' }}>
                            <div>
                                <label>Sınıf Ortalaması</label>
                                <input name="class_avg" type="number" step="0.01" required onChange={handleChange} />
                            </div>
                            <div>
                                <label>Standart Sapma</label>
                                <input name="std_dev" type="number" step="0.01" required onChange={handleChange} />
                            </div>
                        </div>
                    </>
                )}

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button type="button" onClick={onCancel} style={{ background: 'transparent', color: '#fff', border: '1px solid #fff' }}>İptal</button>
                    <button type="submit" className="btn-primary">Dersi Kaydet</button>
                </div>
            </form>
        </div>
    );
};

export default CourseForm;
