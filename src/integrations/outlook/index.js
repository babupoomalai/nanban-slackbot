const tokens = require('./token');
const graph = require('./graph');
const _ = require('lodash');
module.exports = {
  getCalendarEvents: async function (userModel, filterAcceptedOnly = false) {
    try {
      accessToken = await tokens.getUserToken(userModel);
      if (accessToken && accessToken.length > 0) {
        try {
          // Get the events
          var events = await graph.getEvents(accessToken);
          if (filterAcceptedOnly) {
            var filtertedEvents = _.filter(events.value, function (o) {
              return o.responseStatus && o.responseStatus.response && o.responseStatus.response === 'accepted';
            });
            return {
              events: filtertedEvents
            };
          }
          return {
            events: events.value
          };
        } catch (err) {
          console.log(err);
        }
      } else {
        console.log("Token missing");
      }
    } catch (err) {
      console.error(err);
    }
    return {};
  }
};