const event = require('../util/bus');
const constants = require('./constants');
const {getJiraList} = require('../controllers/jira');

class Jira {
    constructor(user) {
        this.user = user;
        if (this.user && this.user.slackProfile) {
            [this.jiraUsername] = this.user.slackProfile.email.split('@');
        }
    }

    async getData() {
        return getJiraList({query: {user: this.jiraUsername}});
    }

    async getRelevantEvents() {
        let data = await this.getData();
        let currentDate = new Date();
        let relevantMessages = data.filter(function (issue) {
            let issueCreated = new Date(issue.fields.created);
            let timeDiff = currentDate - issueCreated;
            if (
                timeDiff > constants.JOB_REPEAT_INTERVAL ||
                timeDiff < 0
            ) {
                return false;
            }
            if (
                issue.fields.priority !== 'Critical' &&
                issue.fields.priority !== 'High'
            ) {
                return false;
            }
            return true;
        });

        return relevantMessages;
    }

    async getMessages() {
        let messages = await this.getRelevantEvents();
        return messages.map(
            issue =>
                `${issue.fields.reporter} assigned an issue to you with ${
                    issue.fields.priority
                } priority: ${issue.fields.summary}`
        );
    }

    async fireMessages() {
        let messages = await this.getMessages();
        for (let message of messages) {
            event.fire('JiraCreationAlert', {
                to: this.user.id,
                data: {message}
            });
        }
        return messages.length;
    }
}

module.exports = Jira;
