const dynamoose = require('dynamoose');

const Schema = dynamoose.Schema;

const schema = new Schema({
    id: { type: String, hashKey: true, validate: (v) => { return v !== ''; } } ,
    slackUserId: String,
    profile: Object
});

module.exports = schema;
