const config = require('./config');
const Display = require('./display');
const WeekInfo = require('./weekinfo');

const services = [
    require('./services/currentday'),
    require('./services/calendar'),
    require('./services/bins'),
    require('./services/runs')
];

console.info('Starting application');

console.info('Initialising display');
let display = new Display();
display.render();

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
    console.log('Resetting screen');
    screen.reset();
    process.nextTick(function () { process.exit(0); });
});

let update = function() {
    console.info('Updating');

    let weekInfo = new WeekInfo(new Date());
    console.info('Week start:', weekInfo.start, ' week end:', weekInfo.end);
    let updatePromises = services.map(service => {
        return service(weekInfo);
    });

    Promise.all(updatePromises).then((data) => {

        // update the display
        data.forEach((val, index) => display.setRow(index, val));
        display.render();
    }, 
    err => display.error(err));
}

update();

// update all services
setInterval(update, config.updateRate * 1000);
