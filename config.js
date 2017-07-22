const Config = {
    brightness: parseInt(process.env['Brightness']) || 127,
    updateRate: parseInt(process.env['UpdateRate']) || 3600, // 1 hour
    runningapi: process.env['RunningAPI'],
    binapihost: process.env['BinAPIHost'] || 'www.southtyneside.gov.uk',
    binAddress: process.env['BinAddress']
};

module.exports = Config;