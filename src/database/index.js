const dynamodb = require('./dynamodb');

const Database = {
};

Database.connect = () => {
    dynamodb.connect();
};

module.exports = Database;
