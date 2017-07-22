var Colour = require('../colour');

module.exports = function(weekInfo) {

    return new Promise(function(accept, reject) {

        accept([
            Colour.BLUE,
            0,
            Colour.GREEN,
            0,
            Colour.RED,
            0,
            0,
            0
        ]);
    });
};