var Colour = require('../colour');

module.exports = function(weekInfo) {

    return new Promise(function(accept) {

        let colours = [0,0,0,0,0,0,0,0];
        
        let index = weekInfo.getDayIndex(new Date());
        colours[index] = Colour.GREY;

        accept(colours);
    });
};