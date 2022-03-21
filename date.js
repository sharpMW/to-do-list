module.exports.getDate = getDate;
// module.exports = "Helloe World";  this string gets exported to app.js
//module.exports is a js object. So, has properties and methods associated with it
function getDate() {
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };

    let day = today.toLocaleDateString("en-us", options);
    return day;
}

module.exports.getDay = getDay;
function getDay() {
    let today = new Date();

    let options = {
        weekday: "long"
    }
    let day = today.toLocaleDateString("en-us", options);
    return day;
}