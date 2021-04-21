const browserObject = require('./lib/browser');
const scraperController = require('./lib/pageController');
var fs = require('fs');

(async () => {
    //Start the browser and create a browser instance
    let browserInstance = await browserObject.startBrowser();
    // Pass the browser instance to the scraper controller
    // scraperController(browserInstance)
    let categories = JSON.parse(fs.readFileSync('./products.json', 'utf8'));
    for(let cat of categories) {
        for(let product of cat.products) {
            if(product.info && product.info.isError) {
                let page = await browserInstance.newPage();
                // console.log(`Navigating to ${this.url}...`);
                // Navigate to the selected page
                await page.goto(product.link);

                break
            }
            break
        }
    }

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

})();