

const sModel = require('../models/planner');
const moment = require('moment');
const { getJiraList } = require('./jira');
const {getCalendarEvents} = require('../integrations/outlook');
const logger = require('log4js').getLogger();

const MAND_BREAKS = [
    { name: "Morning Fitness", type: "fitness", start: moment().startOf('day').set({ "hour": 6, "minute": 0 }), end: moment().startOf('day').set({ "hour": 6, "minute": 30 }) },
    { name: "Breakfast", type: "food", start: moment().startOf('day').set({ "hour": 7, "minute": 30 }), end: moment().startOf('day').set({ "hour": 8, "minute": 0 }) },
    { name: "Break Time", type: "casual", start: moment().startOf('day').set({ "hour": 10, "minute": 45 }), end: moment().startOf('day').set({ "hour": 11, "minute": 0 }) },
    { name: "Lunch", type: "food", start: moment().startOf('day').set({ "hour": 12, "minute": 0 }), end: moment().startOf('day').set({ "hour": 13, "minute": 0 }) },
    { name: "Break Time", type: "casual", start: moment().startOf('day').set({ "hour": 15, "minute": 45 }), end: moment().startOf('day').set({ "hour": 16, "minute": 0 }) },
    { name: "Family Time", type: "family", start: moment().startOf('day').set({ "hour": 18, "minute": 0 }), end: moment().startOf('day').set({ "hour": 19, "minute": 0 }) },
    { name:"Dinner", type:"food", start:moment().startOf('day').set({"hour": 19, "minute": 30}), end:moment().startOf('day').set({"hour": 20, "minute": 30})}
];


async function getJiraItems(user) {
    const username = user.jiraUserId;
    try {
        const taskList = await getJiraList({query: {user: username}});
        return taskList;
    } catch (e) {
        logger.error(e);
        return [];
    }
}


// (async () => {
//     console.log(await getJiraItems({ jiraUserId: 'snallayan' }));
// })();

module.exports = async function (user) {

    sModel.initUser(user);
    const jiraItems = await getJiraItems(user);
    jiraItems.forEach((item) => {
        sModel.addTaskItem(user, item);
    });
    const calendarItems = await getCalendarEvents(user);
    calendarItems.events.forEach((item) => {
        sModel.addCalendarItem(user, item);
    });
    MAND_BREAKS.forEach((item) => {
        sModel.addScheduleItem(user, item);
    });
    /*
     1.get jira
     2.get outlook
     3.add MandBreak
     */
    return sModel.getWholePlan(user);

}
