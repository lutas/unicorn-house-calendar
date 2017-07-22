// tracks which runs we have made this week
var config = require('../config');
var http = require('http');
var Colour = require('../colour');

function downloadMonthData(time) {

    return new Promise((accept, reject) => {
        
        let url = config.runningapi + '/' + time.month + '/' + time.year;

        let str = '';
        // connect to running api, get the month data
        http.get(url, res => {

            res.on('data', chunk => str += chunk);
            res.on('end', () => {
                
                accept(JSON.parse(str));
            });
            
            res.on('error', err => {
                console.error('Failed to get run data', err.message);
                reject(err)
            });
        });
    });
}

module.exports = function(weekInfo) {

    return new Promise(function(accept, reject) {

        // we may need 2 bits of data if our week crosses two months
        let monthAtStart = weekInfo.start.getMonth() + 1;
        let monthAtEnd = weekInfo.end.getMonth() + 1;

        let months = [{
            month: monthAtStart,
            year: weekInfo.start.getFullYear()
        }];

        if (monthAtEnd !== monthAtStart) {
            months.push({
                month: monthAtEnd,
                year: weekInfo.end.getFullYear()
            });
        }

        let allData = months.map(downloadMonthData);
        Promise.all(allData).then(data => {
            
            let runsThisWeek = [];
            
            data.forEach(monthRuns => {
                
                monthRuns.details.forEach(run => {
                    let runDate = Date.parse(run.end_time);
                    if (runDate > weekInfo.start && runDate < weekInfo.end) {
                        runsThisWeek.push(run);
                    }
                });
            });

            // map out colours for this week
            let colours = [0, 0, 0, 0, 0, 0, 0, 0];
            runsThisWeek.forEach(run => {
                
                let runDate = new Date(run.end_time);
                let dayIndex = ((runDate.getDay() - 1) % 7);
                colours[dayIndex] = Colour.LIGHT_YELLOW;
            });

            accept(colours);
        }, reject);
    });
};

