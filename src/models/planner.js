const _ = require('lodash');
const {
    v4
} = require('uuid');
const SortedList = require('container-sortedlist');
const moment = require('moment');
const memo = {};

function getTaskItem(item) {
    return {
        id: item.id || v4(),
        name: item.key,
        desc: item.fields.summary,
        state: item.fields.status || 'Open',
        priority: item.fields.priority || 'Normal',
        data: item
    }
}

function getScheduleItem(item) {
    return {
        id: v4(),
        name: item.name,
        start: moment(item.start),
        end: moment(item.end),
        isCalendar: false,
        type: item.type,
        data: item
    }
}

function getCalendarItem(item) {
    return {
        id: item.id || v4(),
        name: item.subject,
        organizer: item.organizer.emailAddress.name,
        start: moment(item.start.dateTime),
        end: moment(item.end.dateTime),
        isCalendar: true,
        data: item
    }
}

function Tasks() {
    this.memory = [];
};

Tasks.prototype.groupByState = function () {
    return _.groupBy(this.memory, (item) => {
        return item.state.toLowerCase();
    });
}

Tasks.prototype.groupByPriority = function () {
    return _.groupBy(this.memory, (item) => {
        return item.priority.toLowerCase();
    });
}

Tasks.prototype.addItem = function (item) {
    this.memory.push(getTaskItem(item));
}

Tasks.prototype.getAll = function () {
    return this.memory;
}


function isInBetween(e1, e2) {
    return e1.start.isBetween(e2.start, e2.end) || e1.end.isBetween(e2.start, e2.end);
}

function Schedule() {
    this.memory = new SortedList((a, b) => {
        if (a.isCalendar && b.isCalendar) {
            return a.start.unix() - b.start.unix();
        } else if (a.isCalendar || b.isCalendar) {
            if (isInBetween(a, b)) {
                // var calendarItem = a.isCalendar ? a : b;
                return a.start.unix() - b.start.unix();
            } else {
                return a.start.unix() - b.start.unix();
            }
        } else {
            if (isInBetween(a, b)) {
                return a.start.unix() - b.start.unix();
            } else {
                return a.start.unix() - b.start.unix();
            }
        }
    });
}

Schedule.prototype.getAll = function () {
    return this.memory.toArray();
}

Schedule.prototype.add = function (item) {
    return this.memory.add(item);
}

Schedule.prototype.nonCalendarEvents = function () {
    var filterEvents = _.filter(this.memory.toArray(), (a) => {
        return !a.isCalendar;
    });
    return filterEvents;
}



function getUserObj(user) {
    let userItem = memo[user.id];
    if (_.isNil(userItem)) {
        userItem = {
            tasks: new Tasks(),
            schedules: new Schedule(),
            user: user,
        };
        memo[user.id] = userItem;
    }
    return userItem;
}

function _addTaskItem(user, item) {
    getUserObj(user).tasks.addItem(item);
}

function _addScheduleItem(user, item) {
    getUserObj(user).schedules.add(getScheduleItem(item));
}

function _addCalendarItem(user, item) {
    getUserObj(user).schedules.add(getCalendarItem(item));;
}



module.exports = {
    initUser(user) {
        const userItem = {
            tasks: new Tasks(),
            schedules: new Schedule(),
            user: user,
        };
        memo[user.id] = userItem;
    },
    addTaskItem(user, item) {
        _addTaskItem(user, item);
        return getUserObj(user);
    },
    addCalendarItem(user, item) {
        _addCalendarItem(user, item);
        return getUserObj(user);
    },
    addScheduleItem(user, item) {
        _addScheduleItem(user, item);
    },
    getWholePlan(user) {
        return getUserObj(user);
    },
    getMemo() {
        return memo;
    },
    isPlanExist(user) {
        return !_.isNil(memo[user.id]);
    }
}

// var a = new Tasks();
// a.addItem({ name: "T1", state: "Open", priority: "High" });
// a.addItem({ name: "T2", state: "In-Progress", priority: "High" });
// a.addItem({ name: "T1", state: "Blocked", priority: "Critical" });
// console.log(a.getAll());
// console.log(a.groupByState());
// console.log(a.groupByPriority());

// var a = new SortedList((a, b) => {
//     return moment(a.time).unix() - moment(b.time).unix();
// });
// a.add({ name: "e1", time: '2020-04-23T17:00:00' });
// a.add({ name: "e2", time: '2020-04-23T12:00:00' });
// a.add({ name: "e3", time: '2020-04-23T11:00:00' });
// console.log(a.toArray());
