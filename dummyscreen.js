module.exports = {

    init: function(ledCount) {
        console.info('SCREEN: Init with', ledCount, 'leds');
    },

    setBrightness: function(brightness) {
        console.info('SCREEN: brightness', brightness);
    },

    render: function(pixelData) {
        console.info('SCREEN: render');
        for (let row = 0; row < 4; ++row) {
            console.info(pixelData.slice(row * 8, row * 8 + 8));
        }
    }
};