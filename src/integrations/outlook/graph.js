// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

var graph = require('@microsoft/microsoft-graph-client');
const moment = require('moment');
require('isomorphic-fetch');

module.exports = {
  getUserDetails: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);

    const user = await client.api('/me').get();
    return user;
  },

  // <GetEventsSnippet>
  getEvents: async function(accessToken) {
    const client = getAuthenticatedClient(accessToken);
    const start_datetime = moment().startOf('day').utc().format();
    const end_datetime = moment().endOf('day').utc().format();
    try {
      const events = await client
        .api(`/me/calendar/calendarView?startDateTime=${start_datetime}&endDateTime=${end_datetime}`)
        .header('Prefer','outlook.timezone="Asia/Kolkata"')
        .orderby('createdDateTime DESC')
        .get();

      return events;
    } catch (e) {
      console.error(e);
    }
  }
  // </GetEventsSnippet>
};

function getAuthenticatedClient(accessToken) {
  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider: (done) => {
      done(null, accessToken);
    }
  });

  return client;
}