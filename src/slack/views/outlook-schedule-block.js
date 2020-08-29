const moment = require('moment');
const dividerBlock = require('./divider-block');

const generateBlock = (scheduleList) => {
    const scheduleBlock = [];

    scheduleList.forEach((scheduleItem) => {
        let scheduleItemBlock = {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `*${scheduleItem.name}*\n${scheduleItem.start.format('h:mm a')} — ${scheduleItem.end.format('h:mm a')}  ${ scheduleItem.organizer ? ('|  ' + scheduleItem.organizer) : '' }`
            }
        };
        if (scheduleItem.isCalendar &&
            scheduleItem.data.responseStatus &&
            scheduleItem.data.responseStatus.response &&
            scheduleItem.data.responseStatus.response === 'accepted') {
            scheduleItemBlock["accessory"] = {
                "type": "button",
                "text": {
                    "type": "plain_text",
                    "text": "Join Zoom Call",
                    "emoji": true
                },
                "style": "primary",
                "value": "join"
            };
        }
        Array.prototype.push.apply(scheduleBlock, [ scheduleItemBlock ]);
        Array.prototype.push.apply(scheduleBlock, dividerBlock());
    });

    return scheduleBlock;
};

module.exports = generateBlock;
