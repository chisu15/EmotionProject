module.exports.formatTimeFromDate = function(date) {
    return date.toISOString().split('T')[1].slice(0, 8);
};