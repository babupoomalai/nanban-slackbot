// const dynamoose = require('dynamoose');
// const schema = require('./schema');

const model = {};

model.save = (item) => {
    if ( !model.store ) model.store = [];
    let index = model.store.findIndex((i) => { return item.id === i.id; });
    if (index !== -1) {
        model.store.splice(index,1);
        model.store.push(item);
    } else {
        model.store.push(item);
    }
};

model.get = (id) => {
    if ( !model.store ) return null;
    return model.store.find((item) => { return item.id === id; });
};

model.getBySlackUserId = (slackUserId) => {
    if ( !model.store ) return null;
    return model.store.find((item) => { return item.slackUserId === slackUserId; });
};

model.getAll = () => {
    if ( !model.store ) return [];
    return model.store;
};

module.exports = model;
