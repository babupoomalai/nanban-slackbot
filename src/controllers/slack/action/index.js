const logger = require('log4js').getLogger();

const actionEvents = require('./events');

const actionHandler = (req, res, next) => {
    let params = req.body;

    if (params.challenge) {
        res.send(params.challenge);
    } else {
        let actionEvent = actionEvents[params.event.type];
        actionEvent.handler(params);
        res.status(200);
    }
};

module.exports = actionHandler;
