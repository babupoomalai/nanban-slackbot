const dividerBlock = require('./divider-block');

const generateBlock = (quoteText) => {
    let lines = quoteText.split('\n');
    lines = lines.map(line => `> _${line}_`);
    quoteText = lines.join('\n');
    return [
        {
            type: "section",
            text: {
                type: "mrkdwn",
                text: "*Quote of the day*"
            }
        },
        ...dividerBlock(),
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `${quoteText}`
            }
        }
    ];
};

module.exports = generateBlock;
