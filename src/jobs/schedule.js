const planner = require('../models/planner');
const event = require('../util/bus');
const constants = require('./constants');


class Schedule {
    constructor(user) {
        this.user = user;
    }

    async getData() {
        // get data from outlook
        // return JSON.parse(fs.readFileSync(path.join(__dirname, 'sample_outlook.json').toString()));
        return planner.getWholePlan(this.user).schedules.nonCalendarEvents();
    }

    async getRelevantEvents() {
        let data = await this.getData();
        let currentDate = new Date();
        let relevantMessages = data.filter(function(event) {
            let meetingStart = new Date(event.start.dateTime);
            let timeDiff = currentDate - meetingStart;
            if (timeDiff > constants.JOB_REPEAT_INTERVAL || timeDiff < 0) {
                return false;
            }
            return true;
        });

        return relevantMessages;
    }

    async getMessages() {
        let messages = await this.getRelevantEvents();
        return messages;
    }

    async fireMessages() {
        let messages = await this.getMessages();
        for (let message of messages) {
            event.fire('PlannerAlert', {
                to: this.user.id,
                data: { message }
            });
        }

        return messages.length;
    }
}

module.exports = Schedule;
