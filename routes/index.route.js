const emotion = require('./emotion.route')
const user = require('./user.route')
const diary = require('./diary.route')
const remind = require('./remind.route')
const suggestion = require('./suggestion.route')
module.exports = (app) =>
{
    const version = "/api/v1";
    app.use(version + "/emotion", emotion);
    app.use(version + "/user", user);
}

