const logger = require('log4js').getLogger();
const uuid = require('uuid').v1;

const User = require('src/models/user');
const { fire } = require('src/util/bus');
const webClient = require('src/slack/web-api-client');

const appHomeOpenedHandler = async (params) => {
    let slackUserId = params.event.user;

    try {
        let user = User.getBySlackUserId(slackUserId);
        if (!user) {
            const userProfileResponse = await webClient.users.profile.get({
                user: slackUserId
            });
            const user = {
                id: uuid(),
                slackUserId: slackUserId,
                slackProfile: userProfileResponse.profile,
                presenceTime: 0
            };
            User.save(user);
            logger.info('New user added to database.');
            logger.info(User.getAll());
            fire('updateHome', user);
        }
    } catch (e) {
        logger.error(e);
    }
};

module.exports = appHomeOpenedHandler;
