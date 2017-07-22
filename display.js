const screen = require('rpi-ws281x-native');
//const screen = require('./dummyscreen');
const config = require('./config');

const NUM_LEDS = 32;
const ROW_LENGTH = 8;
const NUM_ROWS = NUM_LEDS / ROW_LENGTH;

const pixelData = new Uint32Array(NUM_LEDS);
screen.init(NUM_LEDS);
screen.setBrightness(config.brightness);

const Row = function(index) {

    let pixOffset = index * ROW_LENGTH;

    return {
        // day 0 = monday
        setDay: function(day, col) {
            pixelData[pixOffset + day] = col;
        },

        clearDay: function(day) {
            pixelData[pixOffset + day] = 0;
        }
    };
};

const Calendar = function() {

    let rows = [];
    for (let r = 0; r < NUM_ROWS; ++r) {

        rows.push(new Row(r));
    }

    return {

        setRow: function(row, data) {
            data.forEach((col, index) => {

                rows[row].setDay(index, col);
            });
        },

        render: function() {
            screen.render(pixelData);
        }
    }
};

module.exports = Calendar;