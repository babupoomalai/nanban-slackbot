const createNewMeeting = require('./index');
const sendMessage = require('./api');

(async => {
    // console.log(postMessage(["U0123A4QL3G"], "http://gmail.com"));
   let url = createNewMeeting();
})();