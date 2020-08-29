const dynamoose = require('dynamoose');
const logger = require('log4js').getLogger();

const Dynamoose = {
};

Dynamoose.connect = () => {
    dynamoose.AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });
    dynamoose.local('http://localhost:8000');
    logger.info('Configuring to listen Local DynamoDB - Done');
};

module.exports = Dynamoose;
