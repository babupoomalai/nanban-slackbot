const dividerBlock = require('./divider-block');

const generateBlock = (slackUserId) => {
    return [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": "*Authorize & Integrate*"
            }
        },
        ...dividerBlock(),
        {
            "type": "actions",
            "elements": [
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Outlook",
                        "emoji": true
                    },
                    "action_id": "authorize_outlook",
                    "url": `${process.env.HOST}/api/integrations/outlook/initiate?slackUserId=${slackUserId}`,
                    "value": "outlook"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Jira",
                        "emoji": true
                    },
                    "action_id": "authorize_jira",
                    "url": `${process.env.HOST}/api/integrations/jira/initiate?slackUserId=${slackUserId}`,
                    "style": "primary",
                    "value": "jira"
                },
                {
                    "type": "button",
                    "text": {
                        "type": "plain_text",
                        "text": "Zoom",
                        "emoji": true
                    },
                    "action_id": "authorize_zoom",
                    "url": `${process.env.HOST}/api/integrations/zoom/initiate?slackUserId=${slackUserId}`,
                    "style": "primary",
                    "value": "zoom"
                }
            ]
        }
    ];
};

module.exports = generateBlock;
