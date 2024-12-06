import React, { useState } from 'react'; // Import useState from React
import { v4 as uuid } from 'uuid'; // Import uuid to generate unique IDs
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'; // Import drag-drop components
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const FormBuilder = () => {
    const navigate = useNavigate(); // useNavigate hook for navigation
    const [form, setForm] = useState({
        title: 'Untitled Quiz',
        headerImage: '',
        questions: []
    });

    // Adding a new question type
    const addQuestion = (type) => {
        const newQuestion = {
            id: uuid(),
            type,
            content: '',
            options: [], // Ensure it's an array
            items: [], // Ensure it's an array
            categories: [], // Ensure it's an array
            points: 0,
            correctAnswers: [],
            image: '',
            isEditing: true
        };
        setForm({ ...form, questions: [...form.questions, newQuestion] });
    };

    // Function to toggle edit mode for a question
    const toggleEditQuestion = (index) => {
        const newQuestions = form.questions.slice();
        newQuestions[index].isEditing = !newQuestions[index].isEditing;
        setForm({ ...form, questions: newQuestions });
    };

    const handleInputChange = (index, field, value) => {
        const newQuestions = form.questions.slice();
        if (field === 'categories' || field === 'items' || field === 'options') {
            // Convert comma-separated string to array
            newQuestions[index][field] = value.split(',').map(item => item.trim());
        } else {
            newQuestions[index][field] = value;
        }
        setForm({ ...form, questions: newQuestions });
    };

    const handleAddItem = (index, field) => {
        const newQuestions = form.questions.slice();
        newQuestions[index][field].push(''); // Add a new blank field
        setForm({ ...form, questions: newQuestions });
    };

    const handleRemoveItem = (index, field, itemIndex) => {
        const newQuestions = form.questions.slice();
        newQuestions[index][field].splice(itemIndex, 1); // Remove the item
        setForm({ ...form, questions: newQuestions });
    };

    const deleteQuestion = (index) => {
        const newQuestions = form.questions.slice();
        newQuestions.splice(index, 1);
        setForm({ ...form, questions: newQuestions });
    };

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const newQuestions = Array.from(form.questions);
        const [movedItem] = newQuestions.splice(result.source.index, 1);
        newQuestions.splice(result.destination.index, 0, movedItem);
        setForm({ ...form, questions: newQuestions });
    };

    const saveForm = async (redirect) => {
        try {
            const response = await fetch('http://localhost:5000/api/forms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await response.json();
            alert(`Form saved with ID: ${data._id}`);
            if (redirect) {
                navigate(`/form/${data._id}`); // Redirect to the form details page
            }
        } catch (error) {
            console.error("Error saving form:", error);
        }
    };

    return (
        <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
            <header className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    className="text-2xl font-bold border-0 border-b border-gray-300 outline-none focus:border-blue-500"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
                <div className="flex items-center space-x-4">
                    <button onClick={() => saveForm(false)} className="bg-blue-500 text-white p-2 rounded">
                        Save
                    </button>
                    <button onClick={() => saveForm(true)} className="bg-green-500 text-white p-2 rounded">
                        Save & Proceed
                    </button>
                </div>
            </header>
            <input
                type="text"
                placeholder="Header Image URL"
                value={form.headerImage}
                onChange={(e) => setForm({ ...form, headerImage: e.target.value })}
                className="border border-gray-300 rounded p-2 mb-4 w-full"
            />
            <div className="flex space-x-4 mb-4">
                <button onClick={() => addQuestion('Categorize')} className="bg-blue-500 text-white p-2 rounded">
                    Add Categorize Question
                </button>
                <button onClick={() => addQuestion('Cloze')} className="bg-green-500 text-white p-2 rounded">
                    Add Cloze Question
                </button>
                <button onClick={() => addQuestion('Comprehension')} className="bg-yellow-500 text-white p-2 rounded">
                    Add Comprehension Question
                </button>
                <button onClick={() => addQuestion('Match the Following')} className="bg-purple-500 text-white p-2 rounded">
                    Add Match the Following Question
                </button>
                <button onClick={() => addQuestion('Fill in the Blanks')} className="bg-teal-500 text-white p-2 rounded">
                    Add Fill in the Blanks Question
                </button>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="questions">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {form.questions.map((question, index) => (
                                <Draggable key={question.id} draggableId={question.id} index={index}>
                                    {(provided) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="border border-gray-300 rounded p-4 mb-4 bg-gray-50"
                                        >
                                            {question.isEditing ? (
                                                <>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <input
                                                            type="text"
                                                            name="content"
                                                            placeholder="Question Content"
                                                            value={question.content}
                                                            onChange={(e) => handleInputChange(index, 'content', e.target.value)}
                                                            className="border border-gray-300 rounded p-2 mb-2 w-full"
                                                        />
                                                        <input
                                                            type="number"
                                                            name="points"
                                                            placeholder="Points"
                                                            value={question.points}
                                                            onChange={(e) => handleInputChange(index, 'points', e.target.value)}
                                                            className="border border-gray-300 rounded p-2 ml-2 mb-2"
                                                        />
                                                    </div>

                                                    {question.type === 'Categorize' && (
                                                        <>
                                                            <input
                                                                type="text"
                                                                name="categories"
                                                                placeholder="Categories (comma separated)"
                                                                value={Array.isArray(question.categories) ? question.categories.join(', ') : ''}
                                                                onChange={(e) => handleInputChange(index, 'categories', e.target.value)}
                                                                className="border border-gray-300 rounded p-2 mb-2 w-full"
                                                            />
                                                            {question.categories.map((category, catIndex) => (
                                                                <div key={catIndex} className="flex justify-between mb-2">
                                                                    <input
                                                                        type="text"
                                                                        placeholder={`Category #${catIndex + 1}`}
                                                                        value={category}
                                                                        onChange={(e) => handleInputChange(index, 'categories', question.categories.map((cat, idx) => idx === catIndex ? e.target.value : cat))}
                                                                        className="border border-gray-300 rounded p-2 w-full"
                                                                    />
                                                                    <button
                                                                        onClick={() => handleRemoveItem(index, 'categories', catIndex)}
                                                                        className="bg-red-500 text-white p-1 rounded"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            <button
                                                                onClick={() => handleAddItem(index, 'categories')}
                                                                className="bg-blue-500 text-white p-2 rounded"
                                                            >
                                                                Add Category
                                                            </button>
                                                        </>
                                                    )}
                                                    {question.type === 'Cloze' && (
                                                        <>
                                                            <input
                                                                type="text"
                                                                name="options"
                                                                placeholder="Options (comma separated)"
                                                                value={Array.isArray(question.options) ? question.options.join(', ') : ''}
                                                                onChange={(e) => handleInputChange(index, 'options', e.target.value)}
                                                                className="border border-gray-300 rounded p-2 mb-2 w-full"
                                                            />
                                                            {question.options.map((option, optIndex) => (
                                                                <div key={optIndex} className="flex justify-between mb-2">
                                                                    <input
                                                                        type="text"
                                                                        placeholder={`Option #${optIndex + 1}`}
                                                                        value={option}
                                                                        onChange={(e) => handleInputChange(index, 'options', question.options.map((opt, idx) => idx === optIndex ? e.target.value : opt))}
                                                                        className="border border-gray-300 rounded p-2 w-full"
                                                                    />
                                                                    <button
                                                                        onClick={() => handleRemoveItem(index, 'options', optIndex)}
                                                                        className="bg-red-500 text-white p-1 rounded"
                                                                    >
                                                                        Remove
                                                                    </button>
                                                                </div>
                                                            ))}
                                                            <button
                                                                onClick={() => handleAddItem(index, 'options')}
                                                                className="bg-blue-500 text-white p-2 rounded"
                                                            >
                                                                Add Option
                                                            </button>
                                                        </>
                                                    )}
                                                </>
                                            ) : (
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold">{question.content}</span>
                                                    <button
                                                        onClick={() => toggleEditQuestion(index)}
                                                        className="bg-yellow-500 text-white p-2 rounded"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => deleteQuestion(index)}
                                                        className="bg-red-500 text-white p-2 rounded"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default FormBuilder;
