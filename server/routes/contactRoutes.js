const express = require('express');
const router = express.Router();

const { leaveMessage } = require('./../contorllers/contactController');

router.post('/leaveMessage',leaveMessage);

module.exports = router;
