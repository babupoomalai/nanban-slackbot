const {findOpenConversations} = require('./api');
const questionFinder = require('./questionFinder');

(async => {
    console.log(findOpenConversations());
})();