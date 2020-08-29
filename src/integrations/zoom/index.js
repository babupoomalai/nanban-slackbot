const Client = require('node-rest-client').Client;
const client = new Client();
const sendInvitation = require('./api');

function generatePassword(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getMeetingUrl(userIds, say) {
    var params = {
        topic: "Call My Buddy",
        type: 2,
        duration: 30,
        password: generatePassword(10),
        timezone: "Asia/Kolkata",
        settings: {
            "join_before_host": true,
            "use_pmi": false,
            "waiting_room": false,
            "watermark": false,
        }
    };

    var options = {
        // "method": "POST",
        // "hostname": "api.zoom.us",
        // "port": null,
        // "path": "/v2/users/MwjES07uQ2Sp9XExYrjJZQ/meetings",
        "headers": {
            "content-type": "application/json",
            "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6IndjekRkd05WUm9hLVhSRk9KQVJEUUEiLCJleHAiOjE1ODgxNjU1NDYsImlhdCI6MTU4NzU2MDc0N30.rftSmXkb-bAqCk-JsoV6CsJked0cM6I5e6mDQVP4nos"
        },
        data: JSON.stringify(params)

    };
    client.post("https://api.zoom.us/v2/users/MwjES07uQ2Sp9XExYrjJZQ/meetings", options, function (data, response) {
        //list of user ids to be passed as params
        const meetingUrl = data.join_url;
        // first nanban bot id - U011XDQ17ML, varsha - U0123A4QL3G, mine - U0123TBFC8M
        let hardCodedUserIds = ["U011XDQ17ML", "U012E28AS9H", "U0123TBFC8M"];
        sendInvitation([...userIds, ...hardCodedUserIds], meetingUrl);
        say(meetingUrl);
    });
}

const createNewMeeting = async (params, say) => {
    console.log("params" + JSON.stringify(params));
    let text = params.text;
    let userIds = [];

    if (text.indexOf('<@') > -1) {
        text.split(/ |\s /).forEach(function (val, index) {
            userIds.push(val.split('@').pop().split('|')[0]);
        });
    }
    userIds.push(params.user_id);

    getMeetingUrl(userIds, say);
};
// function createNewMeeting(params, say) {
//     // console.log("params" + params);
//
// }

module.exports = createNewMeeting