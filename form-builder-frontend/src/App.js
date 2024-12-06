import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import FormBuilder from './FormBuilder';
import FormPreview from './FormPreview';
import SuccessPage from './SuccessPage'; // Import the new SuccessPage

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <Routes>
                    <Route path="/" element={<FormBuilder />} />
                    <Route path="/form/:id" element={<FormPreview />} />
                    <Route path="/success" element={<SuccessPage />} /> {/* Add route for SuccessPage */}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
