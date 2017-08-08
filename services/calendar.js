var config = require('../config');
var https = require('https');
var Colour = require('../colour');
var ical = require('node-ical');
var moment = require('moment-timezone');

function download(url) {

    return new Promise(function(accept, reject) {

        var result = "";

        var req = https.get(url, function(response) {

            if (response.statusCode != 200) {
                reject(response);
                return;
            }

            response.on('data', function(buff) {
                result += buff;
            });

            response.on('end', function() {
                accept(result);
            });
        });

        req.on('error', reject);
    });
}

var Calendar = function(result) {

    var data = ical.parseICS(result);
    
    var events = [];
    for (k in data) {
        if (data.hasOwnProperty(k) && data[k].hasOwnProperty("summary")) {
            // cache flattened startTime for later sorting

            data[k].start = moment.utc(data[k].start).tz("Europe/London").format();
            data[k].end = moment.utc(data[k].end).tz("Europe/London").format();

            data[k].startTime = new Date(data[k].start).getTime();
            events.push(data[k]);
        }
    }

    return {

        getRecentEvents: function(start, end) {
            
            var filtered = events.reduce(function(prev, val) {

                if (val.startTime >= start && val.startTime < end) {
                    prev.push(val);
                }
                return prev;
            }, []);

            filtered.sort(function(a, b) { 
                return a.startTime - b.startTime;
            });

            return filtered;
        }
    };
};

module.exports = function(weekInfo) {

    return new Promise((accept, reject) => {

        download(config.calendarUrl).then(result => {

            var calendar = new Calendar(result);
            
            // once we have a calendar representation, work out what days
            // have events this week
            let thisWeek = calendar.getRecentEvents(weekInfo.start, weekInfo.end);
            
            // return colours for each bin
            let colours = [0, 0, 0, 0, 0, 0, 0, 0];
            thisWeek.forEach(evt => {
                
                colours[weekInfo.getDayIndex(new Date(evt.start))] = Colour.GREEN;
            });

            accept(colours);

        }, reject);
    });
};