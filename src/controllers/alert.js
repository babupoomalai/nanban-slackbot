const User = require('src/models/user');
const web = require('../slack/web-api-client');
const bus = require('../util/bus')

setInterval(async function() {
    var allUsers = User.getAll();
    for(userIndex in allUsers) {
        var user = allUsers[userIndex];
        var presence = await web.users.getPresence({
            user: user.slackUserId
        });
        if (presence.presence == 'active')
            user.presenceTime += 5;
        else
            user.presenceTime = 0;
        if (user.presenceTime>=3600) {
            user.presenceTime = 0;
            bus.fire('waterBreak', {
                id: user.slackUserId,
                message: "Did you know that Drinking Water Can Increase Productivity by 14 Percent? It's time to drink some water"
            });
        }
        User.save(user);
    }
}, 5000);
