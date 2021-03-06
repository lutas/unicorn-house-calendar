module.exports = {
    
    RED: 0xFF0000,
    GREEN: 0x00FF00,
    BLUE: 0x0000FF,
    GREY: 0xBBBBBB,
    YELLOW: 0xFFFF00,

    LIGHT_YELLOW: 0xFFFF66,

    fromRGB: function(r, g, b) {
        return ((r & 0xff) << 16) + ((g & 0xff) << 8) + (b & 0xff);
    }
};