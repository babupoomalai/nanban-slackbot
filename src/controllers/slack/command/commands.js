const dataFeeds = require('./dataFeeds');
const createNewMeeting = require('../../../integrations/zoom');
const takeWaterBreak = require('./takeWaterBreak');
const workBreakHandler = require('src/services/work-break')

const actionEvents = {
    '/quote': {
        handler: dataFeeds.getQuote
    },
    '/news': {
        handler: dataFeeds.getNewsHeadlines
    },
    '/fitness': {
        handler: dataFeeds.getStretches
    },
    '/recipe': {
        handler: dataFeeds.getRedditRecipes
    },
    '/movie': {
        handler: dataFeeds.getRedditMoviePosts
    },
    '/song': {
        handler: dataFeeds.getSongSuggestion
    },
    '/call-my-buddy': {
        handler: createNewMeeting
    },
    '/work-break': {
        handler: workBreakHandler
    },
     '/takewater': {
         handler: takeWaterBreak
    }
};

module.exports = actionEvents;
