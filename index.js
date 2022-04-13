const puppeteer = require('puppeteer');
const domain = process.argv[2];
const selector = process.argv[3];
const urls = [];
if (!domain) {
    throw "Please provide URL as a first argument";
}
if (!selector) {
    throw "Please provide a selector to search as second argument";
}
async function run(url, selector) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    try {
        await page.goto(url);
        const selectorExists = await page.evaluate((selector) => {
            return Promise.resolve(Array.from(document.querySelectorAll(selector)).length > 0);
        }, selector);
        console.log(selectorExists);

    } catch (error) {
        console.log(error.message);
    }
    browser.close();
}
run(domain, selector);