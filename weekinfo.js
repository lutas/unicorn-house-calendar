module.exports = function(date) { 

    let curDay = date.getDay();
    // move from JS 0=sunday, to 0=monday 
    let daysFromMonday = (curDay - 1) % 7;

    let monday = new Date(date.getFullYear(), date.getMonth(), date.getDay() - daysFromMonday);
    let sunday = new Date(date.getFullYear(), date.getMonth(), date.getDay() + (7 - daysFromMonday));

    // work out date info
    return {
        date: date,
        todayNum: daysFromMonday,
        start: monday,
        end: sunday
    }
};