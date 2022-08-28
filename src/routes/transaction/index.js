const express = require('express');
const moment = require('moment');

const router = express.Router();

router.post('/', (req, res) => {
    try {
        if (!req.params.userId) {
            throw new Error('Missing parameters');
        }
    } catch (error) {}
});

module.exports = router;