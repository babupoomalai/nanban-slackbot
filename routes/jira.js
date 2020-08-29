var express = require('express');
var { getJiraList, getJiraListByStatus } = require('../src/controllers/jira');
var router = express.Router();

/* GET users listing. */
router.get('/', async function (req, res) {
    let data = await getJiraList(req);
    res.json(data);
    res.end();
});

router.get('/listByStatus', async function (req, res) {
    let data = await getJiraListByStatus(req);
    res.json(data);
    res.end();
});

module.exports = router;
