/* jshint esversion: 6 */

const events = require("events");
const _ = require("lodash");

const eventEmitter = new events.EventEmitter();
const Logger = require('log4js').getLogger();

module.exports = {
    fire(name, data) {
        Logger.info(`Event Fired : ${name} with data`, data);
        eventEmitter.emit(name, data);
    },
    listen(name, callback) {
        if (!_.isFunction(callback)) {
            const eMsg = `Callback is not a function for event ${name}`;
            Logger.error(eMsg, callback);
            throw new Error(eMsg);
        }
        eventEmitter.on(name, (event_data) => {
            callback(event_data);
        });
    },
};
