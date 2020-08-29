const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const log4js = require('log4js').getLogger();
const moment = require('moment');

log4js.level = 'debug';
require('dotenv').config();

const jobs = require('./src/jobs/jobs');
jobs.startJobs();

const passport = require('passport');
const OIDCStrategy = require('passport-azure-ad').OIDCStrategy;
const session = require('express-session');
const flash = require('connect-flash');
const triggerAlert = require('./src/controllers/alert');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const outlookRouter = require('./routes/outlook');
const slackRouter = require('./routes/slack');
const jiraRouter = require('./routes/jira');
const graph = require('./src/integrations/outlook/graph');
const integrationsRouter = require('./routes/integrations');

require('src/listeners');

const UserStore = require('./src/models/user');

const app = express();

// Configure passport

// In-memory storage of logged-in users
// For demo purposes only, production apps should store
// this in a reliable storage

// Passport calls serializeUser and deserializeUser to
// manage users
passport.serializeUser(function(user, done) {
  // Use the OID property of the user as a key
  // userModel.set(user.profile.oid, user);
  done (null, user.id);
});

passport.deserializeUser(function(id, done) {
  done(null, UserStore.get(id));
});

// <ConfigureOAuth2Snippet>
// Configure simple-oauth2
const oauth2 = require('simple-oauth2').create({
  client: {
    id: process.env.OAUTH_APP_ID,
    secret: process.env.OAUTH_APP_PASSWORD
  },
  auth: {
    tokenHost: process.env.OAUTH_AUTHORITY,
    authorizePath: process.env.OAUTH_AUTHORIZE_ENDPOINT,
    tokenPath: process.env.OAUTH_TOKEN_ENDPOINT
  }
});
// </ConfigureOAuth2Snippet>

// Callback function called once the sign-in is complete
// and an access token has been obtained
// <SignInCompleteSnippet>
async function signInComplete(req, iss, sub, profile, accessToken, refreshToken, params, done) {
  if (!profile.oid) {
    return done(new Error("No OID found in user profile."));
  }

  try{
    const user = await graph.getUserDetails(accessToken);

    if (user) {
      // Add properties to profile
      profile['email'] = user.mail ? user.mail : user.userPrincipalName;
    }
  } catch (err) {
    return done(err);
  }

  // Create a simple-oauth2 token from raw tokens
  let oauthToken = oauth2.accessToken.create(params);

  // Save the profile and tokens in user storage
  let user = UserStore.getBySlackUserId(req.session.slackUserId);
  user.outlookProfile = profile;
  user.outlookUserId = profile.oid;
  user.outlookToken = oauthToken;
  user.email = profile.email;
  user.jiraUserId = user.email.match(/^([^@]*)@/)[1];
  UserStore.save(user);
  return done(null, user);
}
// </SignInCompleteSnippet>

// Configure OIDC strategy
passport.use(new OIDCStrategy(
  {
    identityMetadata: `${process.env.OAUTH_AUTHORITY}${process.env.OAUTH_ID_METADATA}`,
    clientID: process.env.OAUTH_APP_ID,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: process.env.OAUTH_REDIRECT_URI,
    allowHttpForRedirectUrl: true,
    clientSecret: process.env.OAUTH_APP_PASSWORD,
    validateIssuer: false,
    passReqToCallback: true,
    scope: process.env.OAUTH_SCOPES.split(' ')
  },
  signInComplete
));



// Initialize passport
app.use(passport.initialize());

// <SessionSnippet>
// Session middleware
// NOTE: Uses default in-memory session store, which is not
// suitable for production
app.use(session({
  secret: 'your_secret_value_here',
  resave: false,
  saveUninitialized: false,
  unset: 'destroy'
}));

// Flash middleware
app.use(flash());
app.use(passport.session());


// <FormatDateSnippet>
// TODO: Cleanup
var hbs = require('hbs');
// Helper to format date/time sent by Graph
hbs.registerHelper('eventDateTime', function(dateTime){
  return moment(dateTime).format('M/D/YY h:mm A');
});
// </FormatDateSnippet>


// <AddProfileSnippet>
app.use(function(req, res, next) {
  // Set the authenticated user in the
  // template locals
  if (req.user) {
    res.locals.user = req.user.profile;
  }
  next();
});
// </AddProfileSnippet>

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/jira', jiraRouter);
app.use('/api/slack', slackRouter);
app.use('/outlook', outlookRouter);
app.use('/api/integrations', integrationsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
