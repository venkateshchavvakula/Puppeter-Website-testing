const puppeteer = require("puppeteer");
const browserObject = require('./lib/browser');
const scraperController = require('./lib/pageController');


(async () => {
    //Start the browser and create a browser instance
    let browserInstance = browserObject.startBrowser();
    // Pass the browser instance to the scraper controller
    scraperController(browserInstance)

})();