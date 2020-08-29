const logger = require('log4js').getLogger();
const moment = require('moment');

const outlookScheduleBlock = require('./outlook-schedule-block');
const jiraTasksBlock = require('./jira-tasks-block');
const interestsBlock = require('./interests-block');
const integrationsBlock = require('./integrations-block');
const dividerBlock = require('./divider-block');
const spaceBlock = require('./space-block');
const quoteBlock = require('./quote-block');

const PlannerModel = require('src/models/planner');

const generateView = (user) => {
    const homeBlocks = [];

    const userPlan = PlannerModel.getWholePlan(user);
    const jiraTickets = userPlan.tasks.groupByState();
    const openTickets = jiraTickets.open ? jiraTickets.open.slice(0,5) : [];
    const inprogressTickets = jiraTickets['in progress'] ? jiraTickets['in progress'].slice(0,5) : [];
    const scheduleList = userPlan.schedules.getAll();
    const quoteText = '"Hire character. Train skill."\n-Peter Schutz.';

    Array.prototype.push.apply(homeBlocks, [
        {
            "type": "section",
            "text": {
                "type": "mrkdwn",
                "text": `Hello ${user.slackProfile.display_name}!\n\n_It's a sunny day. Today's temperature is 33 degree celsius_`
            }
        }
    ]);

    Array.prototype.push.apply(homeBlocks, spaceBlock());
    Array.prototype.push.apply(homeBlocks, quoteBlock(quoteText));
    Array.prototype.push.apply(homeBlocks, spaceBlock());
    if (!user.outlookUserId) {
        Array.prototype.push.apply(homeBlocks, integrationsBlock(user.slackUserId));
        Array.prototype.push.apply(homeBlocks, spaceBlock());
    }
    // Array.prototype.push.apply(homeBlocks, interestsBlock());
    // Array.prototype.push.apply(homeBlocks, spaceBlock());
    if (user.outlookUserId) {
        Array.prototype.push.apply(homeBlocks, [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*Today's Schedule*`
                }
            }
        ]);
        Array.prototype.push.apply(homeBlocks, dividerBlock());
        Array.prototype.push.apply(homeBlocks, outlookScheduleBlock(scheduleList));
        Array.prototype.push.apply(homeBlocks, spaceBlock());
    }
    if (inprogressTickets.length > 0) {
        Array.prototype.push.apply(homeBlocks, [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*In Progress Tickets*`
                }
            }
        ]);
        Array.prototype.push.apply(homeBlocks, dividerBlock());
        Array.prototype.push.apply(homeBlocks, jiraTasksBlock(inprogressTickets));
        Array.prototype.push.apply(homeBlocks, spaceBlock());
    }
    if (openTickets.length > 0) {
        Array.prototype.push.apply(homeBlocks, [
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*Open Tickets*`
                }
            }
        ]);
        Array.prototype.push.apply(homeBlocks, dividerBlock());
        Array.prototype.push.apply(homeBlocks, jiraTasksBlock(openTickets));
    }

    logger.info(homeBlocks);
    return {
        "type": "home",
        "blocks": homeBlocks
    };
};

module.exports = generateView;
