const outlook = require('../integrations/outlook');
const event = require('../util/bus');
const constants = require('./constants');


class Outlook {
    constructor(user) {
        this.user = user;
    }

    async getData() {
        // get data from outlook
        // return JSON.parse(fs.readFileSync(path.join(__dirname, 'sample_outlook.json').toString()));
        return outlook.getCalendarEvents();
    }

    async getRelevantEvents() {
        let data = await this.getData();
        let currentDate = new Date();
        let relevantMessages = data.events.filter(function(event) {
            let meetingStart = new Date(event.start.dateTime);
            let timeDiff = currentDate - meetingStart;
            if (timeDiff > constants.JOB_REPEAT_INTERVAL || timeDiff < 0) {
                return false;
            }
            if (event.responseStatus.response !== 'accepted') {
                return false;
            }
            return true;
        });

        return relevantMessages;
    }

    async getMessages() {
        let messages = await this.getRelevantEvents();
        return messages.map(event => `Time for meeting: ${event.subject}`);
    }

    async fireMessages() {
        let messages = await this.getMessages();
        for (let message of messages) {
            event.fire('OutlookMeetingAlert', {
                to: this.user.id,
                data: { message }
            });
        }

        return messages.length;
    }
}

module.exports = Outlook;
