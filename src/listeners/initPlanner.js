const { listen, fire } = require('src/util/bus');

const planner = require('src/controllers/planner');

listen('initPlanner', async (user) => {
    await planner(user);
    fire('updateHome', user);
});
