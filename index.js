const browserObject = require('./lib/browser');
const scraperController = require('./lib/pageController');
var fs = require("fs");

(async () => {
    //Start the browser and create a browser instance
    // let browserInstance = await browserObject.startBrowser();
    // Pass the browser instance to the scraper controller
    // scraperController(browserInstance)
    let categories = JSON.parse(fs.readFileSync('./products.json', 'utf8'));
    let count = 0;
    for(let cat of categories) {
    

        for(let sub of cat.sub_categories) {
            for(let d of sub.products) {
                count++
               }
        }
        for(let sub of cat.products) {
            count++
           }
    }
    console.log(count)

})();