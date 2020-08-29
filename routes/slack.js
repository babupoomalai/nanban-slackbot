const express = require('express');
const router = express.Router();

const interactionHandler = require('src/controllers/slack/interaction');
const actionHandler = require('src/controllers/slack/action');
const commandHandler = require('src/controllers/slack/command');

router.post('/interaction', interactionHandler);
router.post('/action', actionHandler);
router.post(/\/command\/.*/, commandHandler);

module.exports = router;
