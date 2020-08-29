const Outlook = require('./outlook');
const Jira = require('./jira');
const userModel = require('../models/user');
const constants = require('./constants');
const Schedule = require('./schedule');
const User = require('src/models/user');

function startJobs() {
    setInterval(function () {
        let allUsers = userModel.getAll();

        for (let user of allUsers) {
            let outlookObj = new Outlook(user);
            let outlookMeetingReminders = outlookObj.fireMessages();
            let jiraObj = new Jira(user);
            let jiraCreationEvents = jiraObj.fireMessages();
            let scheduleObj = new Schedule(user);
            let scheduleEvents = scheduleObj.fireMessages();

            outlookMeetingReminders
                .then(count =>
                    console.log(
                        `${count} outlook meeting reminder messages fired for user ${
                            user.slackProfile.display_name
                        }`
                    )
                )
                .catch(error => console.log(error));

            jiraCreationEvents
                .then(count =>
                    console.log(
                        `${count} jira creation messages fired for user ${
                            user.slackProfile.display_name
                        }`
                    )
                )
                .catch(error => console.log(error));

            scheduleEvents
                .then(count =>
                    console.log(
                        `${count} planner messages fired for user ${
                            user.slackProfile.display_name
                        }`
                    )
                )
                .catch(error => console.log(error));
        }
    }, constants.JOB_REPEAT_INTERVAL);

    setInterval(async function () {
        const users = User.getAll();
        for (const userObj of users) {

        }

    }, constants.JOB_REPEAT_INTERVAL);
}

function canScheduleBreak(userObj) {
    let currentDate = new Date();
    let currentTime = currentDate.getTime();
    let currentHour = currentDate.getHours();
    if (currentHour < 9) {
        return false;
    }
    if (currentHour > 5) {
        return false;
    }

    //TODO: Check for currrent outlook meeting

    // If last date yesterday
    let lastBreakTime = userObj.lastBreakTime;
    if (new Date(lastBreakTime).getDate() != currentDate.getDate()) {
        userObj.lastBreakTime = currentTime;
        return true;
    }

    if ((currentTime - lastBreakTime) > constants.WORK_BREAK_REPEAT_INTERVAL) {
        return true;
    }
}


module.exports = {
    startJobs
};
