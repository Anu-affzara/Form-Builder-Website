const express = require('express');
const router = express.Router();
const Form = require('../models/Form');

// Create a new form
router.post('/', async (req, res) => {
    try {
        const form = new Form(req.body);
        await form.save();
        res.status(201).send(form);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Get a form by ID
router.get('/:id', async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        res.send(form);
    } catch (err) {
        res.status(404).send(err);
    }
});

// Save a response
router.post('/:id/responses', async (req, res) => {
    try {
        const form = await Form.findById(req.params.id);
        if (!form.responses) {
            form.responses = [];
        }
        form.responses.push(req.body);
        await form.save();
        res.status(201).send(form);
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
