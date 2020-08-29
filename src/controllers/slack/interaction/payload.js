const userUtil = require('../../../util/userUtil');
const User = require('src/models/user');
const Client = require('node-rest-client').Client;
const client = new Client();
const logger = require('log4js').getLogger();
const constants = require('src/jobs/constants');
const moment = require('moment');

const payloadEvents = {};

function getUser(params) {
    const userId = params.user.user_id;
    const userObj = User.getBySlackUserId(userId);
    return userObj;
}

payloadEvents.snoozeBreak = (params, response) => {

    console.log("Inside snoozebreak: " + JSON.stringify(params));
    const userObj = getUser(params);
    if (userObj) {
        // console.log(userObj + " snoozeBreak")
        userObj.lastBreakTime += constants.WORK_BREAK_SNOOZE_INTERVAL;
        User.save(userObj);
    }

    // send success response
    const sendParams = {
        "text": "Ok. Remind you in " + constants.WORK_BREAK_SNOOZE_MINS + " mins."
    };
    var options = {
        "headers": {
            "content-type": "application/json",

        },
        data: JSON.stringify(sendParams)

    };
    // logger.info(JSON.stringify(options) + "\n" + params.response_url + "snoozeBreak");
    logger.info(params.response_url + ' 3');
    client.post(params.response_url, options, function (data, res) {
        console.log(data);
    })
};

payloadEvents.skipDay = (params, response) => {
    const userObj = getUser(params);
    if (userObj) {
        userObj.lastBreakTime = moment().add(1, "days").startOf("day").unix();
        User.save(userObj);
    }

    // send success response
    var options = {
        "headers": {
            "content-type": "application/json",
            "text": "See you tomorrow."
        },
        data: JSON.stringify(params)

    };
    client.post(params.response_url, options, function (data, res) {

    })
};

module.exports = payloadEvents;
