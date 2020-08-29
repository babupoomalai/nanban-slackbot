const payloadEvents = require('./payload');


const actionEvents = {
    'snoozeBreak' : {
        handler: payloadEvents.snoozeBreak
    },

    'skipDay': {
        handler: payloadEvents.skipDay
    }

};

module.exports = actionEvents;