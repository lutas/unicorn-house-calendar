const Colour = require('../colour');
const config = require('../config');
const https = require('https');

Date.prototype.addHours = function(h){
    this.setHours(this.getHours()+h);
    return this;
}

function getBinDays(data, weekInfo) {

    // return colours for each bin
    let colours = [0, 0, 0, 0, 0, 0, 0, 0];

    let greenDate = new Date(data.result.NextGardenCollection.FullDateString).addHours(12);
    let blueDate = new Date(data.result.NextRecyclingCollection.FullDateString).addHours(12);
    let blackDate = new Date(data.result.NextHouseholdCollection.FullDateString).addHours(12);

    if (weekInfo.contains(greenDate)) { 
        colours[weekInfo.getDayIndex(greenDate)] = Colour.GREEN;
    }
    if (weekInfo.contains(blueDate)) {
        colours[weekInfo.getDayIndex(blueDate)] = Colour.BLUE;
    }
    if (weekInfo.contains(blackDate)) {
        colours[weekInfo.getDayIndex(blackDate)] = Colour.GREY;
    }

    return colours;
}

module.exports = function(weekInfo) {

    return new Promise((accept, reject) => {
        var post_data = JSON.stringify({
            jsonrpc: "2.0",
            id: "1500750523672",
            method: "wtGetBinCollectionDates",
            params: {
                "addresscode": config.binAddress
            }
        });
        
        // An object of options to indicate where to post to
        var post_options = {
            host: config.binapihost,
            port: 443,
            path: '/apiserver/ajaxlibrary/',
            method: 'POST',
            headers: {
                'Content-Length': Buffer.byteLength(post_data),
                'Content-Type' : 'application/json'
            }
        };

        // Set up the request
        let str = '';
        var post_req = https.request(post_options, function(res) {
            res.setEncoding('utf8');
            res.on('data', chunk => str += chunk);

            res.on('end', () => {

                let data = JSON.parse(str);
                
                accept(getBinDays(data, weekInfo));
            });

            res.on('error', err => reject(err));
        });

        // post the data
        post_req.write(post_data);
        post_req.end();        
    });


}