const NewsAPI = require('newsapi');
const Client = require('node-rest-client').Client;

const client = new Client();
const newsapi = new NewsAPI(process.env.NEWS_API_TOKEN);
const fitnessLinks = require('../../../data/fitness');

const dataFeeds = {
};

dataFeeds.getQuote = (params, say) => {
  var args = {
        headers: { "Content-Type": "application/json" },
        parameters: {"language":"en"}
    };
    client.registerMethod("jsonMethod", "https://quotes.rest/qod", "GET");
     
    client.methods.jsonMethod(args, function (data, response) {
        var quote=data.contents.quotes[0]
        say(quote.quote+"   -   "+quote.author);
    });
}

getRedditPosts = (category, say) => {
    var args = {
        headers: { "Content-Type": "application/json" },
        parameters: {"language":"en"}
    };
    client.registerMethod("jsonMethod", "https://www.reddit.com/r/"+category+".json", "GET");
     
    client.methods.jsonMethod(args, function (data, response) {
      var foods=data.data.children;
      var sortable = [];
      for (food in foods) {
        sortable.push([food, foods[food].data.score]);
      }
      sortable.sort(function(a, b) {
          return b[1]-a[1];
      });
        var food=foods[sortable[0][0]];
        say('https://www.reddit.com'+food.data.permalink);
    });
}

dataFeeds.getRedditRecipes = (params, say) => {
  getRedditPosts('recipes', say);
}

dataFeeds.getRedditMoviePosts = (params, say) => {
  getRedditPosts('entertainment', say);
}

dataFeeds.getSongSuggestion = (params, say) => {
  var args = {
        headers: { "Content-Type": "application/json" },
        parameters: {
          part:'snippet',
          maxResults:1,
          key:process.env.YOUTUBE_TOKEN,
          order:'rating',
          videocategoryid:10,
          q: "official video",
          safeSearch: "strict"
        }
    };
    client.registerMethod("jsonMethod", "https://www.googleapis.com/youtube/v3/search", "GET");
     
    client.methods.jsonMethod(args, function (data, response) {
        var url="https://www.youtube.com/watch?v=" + data.items[0].id.videoId;
        say(url);
    });
}

dataFeeds.getNewsHeadlines = (params, say) => {
    newsapi.v2.topHeadlines({
        q: params.text,
        language: 'en'
      }).then(response => {
        if (response.articles.length>0) {
          var article = response.articles[0].url;
          say(article);
        } else {
          say('Sorry couldn\'t find');
        }
      });
}

getFitnessSuggestion = (type, say) => {
    var typeSpecificFitness = fitnessLinks[type];
    var index = Math.floor(Math.random() * Math.floor(typeSpecificFitness.length));
    var fitnessSuggestion = typeSpecificFitness[index];
    console.log(index);
    var text = 'Its exercise time! \n';
    if (fitnessSuggestion.type)
        text += '*' + fitnessSuggestion.type + '*\n';
    if (fitnessSuggestion.description)
        text += '_' + fitnessSuggestion.description + '_\n';
    if (fitnessSuggestion.steps)
        for (step in fitnessSuggestion.steps)
            text += fitnessSuggestion.steps[step] + '\n';
    if (fitnessSuggestion.url)
        text += fitnessSuggestion.url;
    say(text);
}

dataFeeds.getStretches = (params, say) => {
  getFitnessSuggestion('stretches', say);
}

dataFeeds.getWorkout = (params, say) => {
  getFitnessSuggestion('fitness', say);
}

module.exports = dataFeeds;
