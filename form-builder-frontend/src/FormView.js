import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const FormView = () => {
    const { formId } = useParams();
    const [form, setForm] = useState(null);
    const navigate = useNavigate(); // useNavigate for redirection

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/forms/${formId}`);
                const data = await response.json();
                setForm(data);
            } catch (error) {
                console.error("Error fetching form:", error);
            }
        };

        fetchForm();
    }, [formId]);

    if (!form) return <div>Loading...</div>;

    // Handle form submission
    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/forms/submit/${formId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ submitted: true }), // You can add any data you need to submit
            });

            if (response.ok) {
                // Redirect to a success page after successful submission
                navigate('/success'); // Replace '/success' with your success route
            } else {
                console.error("Submission failed");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold mb-4">{form.title}</h1>
            <img src={form.headerImage} alt="Header" className="w-full h-48 object-cover mb-4" />
            <div className="space-y-4">
                {form.questions.map((question, index) => (
                    <div key={question.id} className="border border-gray-300 p-4 rounded mb-4">
                        <h2 className="text-xl font-semibold mb-2">{question.content}</h2>
                        <p className="mb-2">{question.points} points</p>
                        
                        {/* Conditionally render question-specific details based on type */}
                        {question.type === 'Categorize' && (
                            <div>
                                <h3 className="font-semibold mb-2">Categories:</h3>
                                <ul className="list-disc pl-6">
                                    {question.categories.map((category, i) => (
                                        <li key={i}>{category}</li>
                                    ))}
                                </ul>
                                <h3 className="font-semibold mt-2 mb-2">Items:</h3>
                                <ul className="list-disc pl-6">
                                    {question.items.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {question.type === 'Cloze' && (
                            <div>
                                <h3 className="font-semibold mb-2">Options:</h3>
                                <ul className="list-disc pl-6">
                                    {question.options.map((option, i) => (
                                        <li key={i}>{option}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {question.type === 'Comprehension' && (
                            <div>
                                <h3 className="font-semibold mb-2">Options:</h3>
                                <ul className="list-disc pl-6">
                                    {question.options.map((option, i) => (
                                        <li key={i}>{option}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {question.type === 'Match the Following' && (
                            <div>
                                <h3 className="font-semibold mb-2">Left Column:</h3>
                                <ul className="list-disc pl-6">
                                    {question.items.left.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                                <h3 className="font-semibold mt-2 mb-2">Right Column:</h3>
                                <ul className="list-disc pl-6">
                                    {question.items.right.map((item, i) => (
                                        <li key={i}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {question.type === 'Fill in the Blanks' && (
                            <div>
                                <h3 className="font-semibold mb-2">Options:</h3>
                                <ul className="list-disc pl-6">
                                    {question.options.map((option, i) => (
                                        <li key={i}>{option}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex justify-center mt-4">
    <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 mx-auto"
    >
        Submit
    </button>
</div>

        </div>
    );
};

export default FormView;
