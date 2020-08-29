const util = require('util');
const request = util.promisify(require('request'));
const fs = require('fs');
const path = require('path');

const priorityValues = {
    Critical: 4,
    High: 3,
    Normal: 2,
    Low: 1
};
class JIRA {
    constructor(user) {
        this.user = user;
        this.baseUrl = 'https://jira.eng.vmware.com/rest/api/latest/';
        this.baseOptions = {
            method: 'POST',
            headers: {
                "Authorization" : "Basic " + new Buffer("username:password").toString("base64"),
                "Content-Type"  : "application/json"
            }
        };
    }

    async request(options) {
        let response = await request(options);
        // console.log(response.body);
        try {
            return JSON.parse(response.body);
        } catch (err) {
            console.log('Token Error: Change src/controllers/cookie.txt with valid JIRA cookie');
        }
    }

    async search(jql, limit = 100) {
        if (!jql) {
            jql = `project = VLENG AND status in ("In Progress", Open, "Product Spec In Review", "Development at Risk", "Verification At Risk")`;
        }
        jql += ` AND assignee in (${this.user}) ORDER BY priority`;
        let url = this.baseUrl + 'search';
        let options = Object.assign({}, this.baseOptions, {
            url,
            body: JSON.stringify({
                jql,
                startAt: 0,
                maxResults: limit,
                fields: [
                    'summary',
                    'created',
                    'priority',
                    'versions',
                    'fixVersions',
                    'description',
                    'updated',
                    'project',
                    'reporter',
                    'labels',
                    'components',
                    'timespent',
                    'status',
                    'duedate'
                ]
            })
        });
        let data = await this.request(options);
        let issueList = data.issues;

        issueList = issueList.map(issue => this.normalizeIssue(issue));
        this.sortList(issueList);
        return issueList;
    }

    normalizeIssue(issue) {
        for (let field of [
            'project',
            'reporter',
            'fixVersions',
            'priority',
            'status'
        ]) {
            issue.fields[field] = issue.fields[field].name;
        }
        for (let field of ['components', 'versions']) {
            issue.fields[field] = issue.fields[field].map(item => item.name);
        }
        return issue;
    }

    sortList(list) {
        return list.sort((a, b) => {
            let priority1 = priorityValues[a.fields.priority] || -1;
            let priority2 = priorityValues[b.fields.priority] || -1;

            if (priority1 > priority2) {
                return -1;
            } else if (priority2 > priority1) {
                return 1;
            }

            let updated1 = new Date(a.fields.updated);
            let updated2 = new Date(b.fields.updated);
            if (updated1 > updated2) {
                return -1;
            } else if (updated2 > updated1) {
                return 1;
            }

            let created1 = new Date(a.fields.created);
            let created2 = new Date(b.fields.created);
            if (created1 > created2) {
                return -1;
            } else if (created2 > created1) {
                return 1;
            }

            if (a.fields.summary < b.fields.summary) {
                return -1;
            } else if (
                b.fields.summary.toLowerCase() < a.fields.summary.toLowerCase()
            ) {
                return 1;
            }

            return 0;
        });
    }
}

async function getJiraList(req) {
    let jql = `project = VLENG AND status in ("In Progress", Blocked, Open, "Product Spec In Review", "Development at Risk", "Verification At Risk")`;
    let jira = new JIRA(req.query.user);
    return jira.search(jql);
}

async function getJiraListByStatus(req) {
    let jira = new JIRA(req.query.user);
    let returnResult = {};

    for (let status of ['In Progress', 'Blocked', 'Open']) {
        let jql = `project = VLENG AND status = "${status}"`;
        let jiraList = await jira.search(jql, 10);
        returnResult[status] = jiraList;
    }
    return returnResult;
}

module.exports = {
    JIRA,
    getJiraList,
    getJiraListByStatus
};
