const { listen } = require('src/util/bus');

const webClient = require('src/slack/web-api-client');
const homeView = require('src/slack/views/home-view');

listen('updateHome', async (user) => {
    await webClient.views.publish({
        user_id: user.slackUserId,
        view: homeView(user)
    });
});
