const logger = require('log4js').getLogger();
const UserStore = require('src/models/user');
const { fire } = require('src/util/bus');
const planner = require('src/controllers/planner');

const outlookInitiateHandler = (req, res, next) => {
    let params = req.query;
    res.redirect('/outlook/signin?slackUserId=' + params.slackUserId);
};

const outlookCompleteHandler = (req, res, next) => {
    let params = req.query;
    const user = UserStore.getBySlackUserId(params.slackUserId);
    fire('initPlanner', user);
    res.send('<script>window.close()</script>');
};

module.exports = {
    outlookInitiateHandler,
    outlookCompleteHandler
};
