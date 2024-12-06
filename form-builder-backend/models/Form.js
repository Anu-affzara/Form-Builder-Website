const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    type: { type: String, required: true },
    content: { type: String, required: true },
    options: [String],
    items: [String],
    categories: [String],
    points: { type: Number, default: 0 },
    image: String,
    correctAnswers: [String],
});

const formSchema = new mongoose.Schema({
    title: { type: String, required: true },
    headerImage: String,
    questions: [questionSchema],
});

module.exports = mongoose.model('Form', formSchema);
