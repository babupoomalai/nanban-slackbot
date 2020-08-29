var express = require('express');
var { createNewMeeting } = require('../src/integrations/zoom/index');
var router = express.Router();

/* GET users listing. */
router.get('/', async function (req, res) {
    let data = await createNewMeeting(req);
    res.json(data);
    res.end();
});

module.exports = router;
