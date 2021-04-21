const pageScraper = require('./pageScraper');

const chalk = require("chalk");

// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
async function scrapeAll(browserInstance) {
    let browser;
    try {
        browser = await browserInstance;
        await pageScraper.scraper(browser);

    }
    catch (err) {
        console.log(error("Could not resolve the browser instance => ", err));
    }
}

module.exports = (browserInstance) => scrapeAll(browserInstance)