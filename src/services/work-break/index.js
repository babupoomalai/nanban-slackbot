const sendMessage = require('./take_a_break');

const workBreak = async (params, response) => {
    console.log("params" + JSON.stringify(params));
    sendMessage(params.user_id);
}

module.exports = workBreak;