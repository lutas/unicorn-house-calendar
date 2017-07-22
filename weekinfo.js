module.exports = function(date) { 

    let curDay = date.getDay();
    // move from JS 0=sunday, to 0=monday 
    let daysFromMonday = ((curDay - 1) % 7);

    let monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - daysFromMonday, 12);
    let sunday = new Date(date.getFullYear(), date.getMonth(), date.getDate() + (6 - daysFromMonday), 12);

    // work out date info
    return {
        date: date,
        todayNum: daysFromMonday + 1,
        start: monday,
        end: sunday,
        contains: function(date) {
            return date >= this.start && date <= this.end;
        },
        getDayIndex: function(date) {
            return (date.getDay() - 1) % 7;
        }
    }
};