const browserObject = require('./lib/browser');
const scraperController = require('./lib/pageController');
var fs = require('fs');

(async () => {
    //Start the browser and create a browser instance
    let browserInstance = await browserObject.startBrowser();
    // Pass the browser instance to the scraper controller
    // scraperController(browserInstance)
    let categories = JSON.parse(fs.readFileSync('./categories_products.json', 'utf8'));
    console.log(categories.length, 'total')
    let count = 0

    let pagePromise = (link) => new Promise(async (resolve, reject) => {
        let dataObj = []
        let newPage = await browserInstance.newPage();
        await newPage.goto(link);
        await newPage.waitForSelector("#page");
        let data = {}
        data['src'] = await newPage.$eval('.row .col-lg-6', el => el.querySelector('img') ? el.querySelector('img').src : '')
        data['srcset'] = await newPage.$eval('.row .col-lg-6', el => el.querySelector('img') ? el.querySelector('img').srcset : '')
        data['alt'] = await newPage.$eval('.row .col-lg-6', el => el.querySelector('img') ? el.querySelector('img').alt : '')
        try {
            await newPage.$eval('.row .col-lg-5 .prod-wrapper', el => el.innerText);
            data['desc'] = await newPage.$eval('.row .col-lg-5 .prod-wrapper', el => el.innerText)

        } catch (e) {
            data['isError'] = true
        }

        resolve(data);
        await newPage.close();
    });

    for (let category of categories) {
        category['sub']=false;
        for (let product of category.products) {
            count++;
            // if (product.link.includes('products')) {
                try {
                    let currentPageData = await pagePromise(product.link);
                    product['info'] = currentPageData
                } catch(e) {
                    category['sub']=true
                }
               
            // } 
            console.log(product.name, count)
        }
    }

    fs.writeFile("products.json", JSON.stringify(categories), function (err) {
        if (err) throw err;
        console.log("Saved!");
    });
})();