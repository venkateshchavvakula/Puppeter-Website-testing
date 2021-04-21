const chalk = require("chalk");
var fs = require("fs");

// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword("green");

const scraperObject = {
    url: 'https://www.eternalmark.com/',
    async scraper(browser) {
        try {
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
        let pagePromise = (link) => new Promise(async(resolve, reject) => {
            let dataObj = {};
            let newPage = await browser.newPage();
            await newPage.goto(link);
            await newPage.waitForSelector("#page");
            dataObj['productsOrCategories'] = await newPage.$$eval('div', element =>{
              return element;
            });
            // dataObj['bookPrice'] = await newPage.$eval('.price_color', text => text.textContent);
            // dataObj['noAvailable'] = await newPage.$eval('.instock.availability', text => {
            //     // Strip new line and tab spaces
            //     text = text.textContent.replace(/(\r\n\t|\n|\r|\t)/gm, "");
            //     // Get the number of stock available
            //     let regexp = /^.*\((.*)\).*$/i;
            //     let stockAvailable = regexp.exec(text)[1].split(' ')[0];
            //     return stockAvailable;
            // });
            // dataObj['imageUrl'] = await newPage.$eval('#product_gallery img', img => img.src);
            // dataObj['bookDescription'] = await newPage.$eval('#product_description', div => div.nextSibling.nextSibling.textContent);
            // dataObj['upc'] = await newPage.$eval('.table.table-striped > tbody > tr > td', table => table.textContent);
            resolve(dataObj);
            await newPage.close();
        });

        for(let data of urls){
            let currentPageData = await pagePromise(data.link);
            // scrapedData.push(currentPageData);
            console.log(currentPageData);
        }



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