const chalk = require("chalk");
var fs = require("fs");

// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword("green");

const scraperObject = {
    url: 'https://www.eternalmark.com/',
    async scraper(browser) {
        try {
            let scrapedData = [];
            let page = await browser.newPage();
            console.log(`Navigating to ${this.url}...`);
            // Navigate to the selected page
            await page.goto(this.url);
            // Wait for the required DOM to be rendered
            await page.waitForSelector("#navbarSupportedContent");
            let urls = await page.$$eval('.mob-menu ul > li', links => {
                // Extract the links from the data
                let categoriesElements = []
                links.forEach(el => {
                    categoriesElements.push({ name: el.querySelector('a').innerText, link: el.querySelector('a').href })
                })
                return categoriesElements;
            });

            // Writing the categories links inside a json file
            fs.writeFile("categories.json", JSON.stringify(urls), function (err) {
                if (err) throw err;
                console.log("Saved!");
            });

            // Loop through each of those links, open a new page instance and get the relevant data from them
            let pagePromise = (link) => new Promise(async (resolve, reject) => {
                let dataObj = []
                let newPage = await browser.newPage();
                await newPage.goto(link);
                await newPage.waitForSelector("#page");
                dataObj = await newPage.$$eval('.row .col-xs-6', element => {
                    let data = []
                    element.forEach(el => {
                        data.push({
                            name: el.querySelector('h2') ? el.querySelector('h2').innerText.replace(/%20/g, " ") : el.querySelector('h6').innerText.replace(/%20/g, " "),
                            image_url: el.querySelector('img').src,
                            image_alt: el.querySelector('img').alt,
                            link: el.querySelector('a').href
                        })
                    });
                    return data;
                });
                resolve(dataObj);
                await newPage.close();
            });

            for (let data of urls) {
                let currentPageData = await pagePromise(data.link);
                let category = {
                    name: data.name,
                    link: data.link,
                    products: currentPageData
                }
                scrapedData.push(category);
                // console.log(currentPageData);
            }
            // let currentPageData = await pagePromise('https://www.eternalmark.com/medical-devices');
            // console.log(currentPageData);

            // Writing the categories links inside a json file
            fs.writeFile("categories_products.json", JSON.stringify(scrapedData), function (err) {
                if (err) throw err;
                console.log("Saved!");
            });


            await browser.close();
        } catch (err) {
            console.log(err)
            // Catch and display errors
            console.log(error(err));
            await browser.close();
            console.log(error("Browser Closed"));
        }
    }
}

module.exports = scraperObject;