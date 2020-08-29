const dividerBlock = require('./divider-block');

const generateBlock = (tickets) => {
    const ticketsBlock = [];

    tickets.forEach((ticket) => {
        let ticketItemBlock = {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `<format>`
            }
        };
        Array.prototype.push.apply(ticketsBlock, [ ticketItemBlock ]);
        Array.prototype.push.apply(ticketsBlock, dividerBlock());
    });

    return ticketsBlock;
};

module.exports = generateBlock;
