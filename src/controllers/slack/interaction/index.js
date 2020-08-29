const logger = require('log4js').getLogger();
const eventHandler = require('./events');

const interactionHandler = (req, res, next) => {
    let body = req.body;
    // logger.info(req);

    // logger.info(JSON.parse(req.body.payload) + " index.js")

    let payload = JSON.parse(req.body.payload);
    const action = payload.actions[0];
    // logger.info(JSON.stringify(action) + " index.js")
    const blockId = action.block_id;
    // logger.info(blockId + " index.js")

    let payloadEvent = eventHandler[blockId];


    payloadEvent.handler(payload, function (text) {
        let data = {
            text: text
        };
        res.json(data);
    });
    res.status(200);

    res.json({});
};

module.exports = interactionHandler;
