const { WebClient } = require('@slack/web-api');

const token = process.env.SLACK_TOKEN;

const webClient = new WebClient(token);

module.exports = webClient;
