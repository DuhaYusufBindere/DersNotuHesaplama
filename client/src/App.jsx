import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import CourseForm from './components/CourseForm';

function App() {
    const [view, setView] = useState('dashboard'); // dashboard, form

    return (
        <div>
            <h1>Üniversite Not Hesaplayıcı</h1>
            {view === 'dashboard' && (
                <Dashboard onAddCourseClick={() => setView('form')} />
            )}
            {view === 'form' && (
                <CourseForm
                    onCancel={() => setView('dashboard')}
                    onSuccess={() => setView('dashboard')}
                />
            )}
        </div>
    );
}

export default App;
