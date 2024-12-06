import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const FormPreview = () => {
    const { id } = useParams();
    const [form, setForm] = useState(null);
    const [responses, setResponses] = useState({});
    const [loading, setLoading] = useState(false); // For loading state
    const [error, setError] = useState(null); // For error handling
    const navigate = useNavigate(); // For redirecting after successful submission

    useEffect(() => {
        const fetchForm = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/forms/${id}`);
                if (!response.ok) throw new Error('Failed to fetch form');
                const data = await response.json();
                setForm(data);
            } catch (err) {
                console.error("Error fetching form:", err);
                setError("There was an error loading the form.");
            }
        };
        fetchForm();
    }, [id]);

    const handleInputChange = (questionIndex, event) => {
        const newResponses = { ...responses, [questionIndex]: event.target.value };
        setResponses(newResponses);
    };

    const submitResponses = async () => {
        setLoading(true); // Start loading
        try {
            const response = await fetch(`http://localhost:5000/api/forms/${id}/responses`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(responses),
            });

            if (!response.ok) throw new Error('Submission failed');
            
            setLoading(false); // Stop loading
            alert('Responses submitted successfully!');
            navigate('/success'); // Redirect to a success page
        } catch (err) {
            setLoading(false); // Stop loading
            setError("There was an error submitting your responses.");
            console.error("Error submitting responses:", err);
        }
    };

    if (!form) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold mb-4">{form.title}</h1>
            {form.headerImage && <img src={form.headerImage} alt="Header" className="mb-4" />}
            
            {form.questions.map((question, index) => (
                <div key={index} className="border border-gray-300 rounded p-4 mb-4 bg-gray-50">
                    <p className="mb-2 font-semibold">{question.content}</p>
                    {question.image && <img src={question.image} alt="Question" className="mb-2" />}
                    
                    {/* Handling Categorize questions */}
                    {question.type === 'Categorize' && (
                        <>
                            {question.items.map((item, itemIndex) => (
                                <div key={itemIndex} className="mb-2">
                                    <label className="block font-semibold mb-1">{item}</label>
                                    <select
                                        value={responses[`${index}-${itemIndex}`] || ''}
                                        onChange={(e) => handleInputChange(`${index}-${itemIndex}`, e)}
                                        className="border border-gray-300 rounded p-2 w-full"
                                    >
                                        <option value="">Select a category</option>
                                        {question.categories.map((category, catIndex) => (
                                            <option key={catIndex} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </>
                    )}

                    {/* Handling Cloze questions */}
                    {question.type === 'Cloze' && (
                        <input
                            type="text"
                            value={responses[index] || ''}
                            onChange={(e) => handleInputChange(index, e)}
                            className="border border-gray-300 rounded p-2 mb-2 w-full"
                        />
                    )}

                    {/* Handling Comprehension questions */}
                    {question.type === 'Comprehension' && (
                        <textarea
                            rows={4}
                            value={responses[index] || ''}
                            onChange={(e) => handleInputChange(index, e)}
                            className="border border-gray-300 rounded p-2 mb-2 w-full"
                        />
                    )}
                </div>
            ))}

            <button
                onClick={submitResponses}
                className="bg-purple-500 text-white p-2 rounded mt-4 w-full"
                disabled={loading} // Disable the button while loading
            >
                {loading ? 'Submitting...' : 'Submit'}
            </button>

            {loading && <div className="mt-2 text-center">Submitting your responses...</div>}
        </div>
    );
};

export default FormPreview;
