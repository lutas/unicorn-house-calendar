const Config = {
    brightness: parseInt(process.env['Brightness']) || 127,
    updateRate: parseInt(process.env['UpdateRate']) || 3600 // 1 hour
};

module.exports = Config;