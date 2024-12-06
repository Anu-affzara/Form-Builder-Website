import React from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
    const navigate = useNavigate();

    // Redirect to the home page or other page after a timeout or when the user clicks the button
    const redirectToHome = () => {
        navigate('/'); // Redirect to home or any other route
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-md rounded-lg max-w-md text-center">
            <h1 className="text-3xl font-bold mb-4 text-green-500">Success!</h1>
            <p className="text-lg mb-6">Your responses have been submitted successfully.</p>
            <button 
                onClick={redirectToHome}
                className="bg-purple-500 text-white p-2 rounded mt-4 hover:bg-purple-600"
            >
                Go to Home
            </button>
        </div>
    );
};

export default SuccessPage;
