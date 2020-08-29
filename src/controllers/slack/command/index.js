const logger = require('log4js').getLogger();
const webClient = require('src/slack/web-api-client');
const slashCommands = require('./commands');

const commandHandler = (req, res, next) => {
    let params = req.body;
    logger.info(params);
    let slashCommand = slashCommands[params.command];
    slashCommand.handler(params, function (text) {
        webClient.chat.postMessage({
            channel: 'U0124BW37D1',
            text: text
        });
        let data = { 
            response_type: 'in_channel',
            text: text}; 
          res.json(data);
    });
    res.status(200);
};

module.exports = commandHandler;
