var express = require('express');
var passport = require('passport');
require('dotenv').config();


var graph = require('../src/integrations/outlook/graph');
var tokens = require('../src/integrations/outlook/token');
var router = express.Router();
const UserStore = require('../src/models/user');

/* GET auth callback. */
router.get('/signin',
  function (req, res, next) {
    req.session.slackUserId = req.query.slackUserId;
    passport.authenticate('azuread-openidconnect', {
      response: res,
      prompt: 'login',
      failureRedirect: '/',
      failureFlash: true,
      successRedirect: '/api/integrations/outlook/complete'
    })(req, res, next);
  }
);

// <CallbackRouteSnippet>
router.post('/callback',
  function (req, res, next) {
    passport.authenticate('azuread-openidconnect', {
      response: res,
      failureRedirect: '/',
      failureFlash: true,
      successRedirect: '/api/integrations/outlook/complete?slackUserId=' + req.session.slackUserId
    })(req, res, next);
  }
);
// </CallbackRouteSnippet>

router.get('/signout',
  function (req, res) {
    req.session.destroy(function (err) {
      req.logout();
      res.redirect('/');
    });
  }
);

router.get('/calendar',
  async function (req, res) {

    let params = {
      active: {
        calendar: true
      }
    };
    let id = req.query.id;
    // Get the access token
    var accessToken;
    try {
      accessToken = await tokens.getUserToken(UserStore.get(id));
    } catch (err) {
      console.log(err);
    }

    if (accessToken && accessToken.length > 0) {
      try {
        // Get the events
        var events = await graph.getEvents(accessToken);
        params.events = events.value;
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("Tockedn misssing");
    }

    res.status(200).send(params);
  }
);


module.exports = router;
