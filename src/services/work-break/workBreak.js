const User = require('../../models/user');
const webClient = require('../../slack/web-api-client');// This argument can be a channel ID, a DM ID, a MPDM ID, or a group ID
const constants = require('src/jobs/constants');
const sendMessage =  require('./take_a_break');

const mins = 0.30;
const interval = mins * 60 * 1000;
// const interval = constants.WORK_BREAK_REPEAT_INTERVAL


module.exports = function () {

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

    setInterval(async function () {
            const userId = 'U0123TBFC8M';

            const userProfileResponse = await webClient.users.profile.get({
                user: userId
            });
            const user = {
                slackUserId: userId,
                profile: userProfileResponse.profile,
                lastBreakTime: 0
            };
            User.save(user);

            const users = User.getAll();


            for (const userObj of users) {
                const flag =  canScheduleBreak(userObj);
                if(flag) {
                    await sendMessage(userObj.slackUserId);
                    user.lastBreakTime = new Date().getTime();
                    User.save(user);
                }
            }

        }, interval
    )
}