const config = require('./config');
const Display = require('./display');
const WeekInfo = require('./weekinfo');

const exampleService = new require('./services/example')();

let display = new Display();

console.info('Starting application');

// ---- trap the SIGINT and reset before exit
process.on('SIGINT', function () {
    console.log('Resetting screen');
    screen.reset();
    process.nextTick(function () { process.exit(0); });
});

let services = [exampleService];

let update = function() {

    let weekInfo = new WeekInfo(new Date());

    console.info('Updating for week start:', weekInfo.start, ' week end:', weekInfo.end);
    let updatePromises = services.map(service => {
        return service.update(weekInfo);
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
