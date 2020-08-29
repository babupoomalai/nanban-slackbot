const express = require('express');
const router = express.Router();

const { outlookInitiateHandler, outlookCompleteHandler } = require('src/integrations/outlookHandler');

router.get('/outlook/initiate', outlookInitiateHandler);
router.get('/outlook/complete', outlookCompleteHandler);

module.exports = router;
