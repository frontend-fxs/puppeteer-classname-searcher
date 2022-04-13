const puppeteer = require('puppeteer');
const domain = process.argv[2];
const selector = process.argv[3];
const unvisitedUrls = [];
const visitedUrls = [];
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
        if(selectorExists){
            console.log(url);
        }
        const domainUrls = await page.evaluate((domain) => {
            return Promise.resolve(Array.from(document.querySelectorAll(`[href^='${domain}']`)).map(item => item.href));
        }, domain);
        domainUrls.map(item => {
            if (!visitedUrls.includes(item) && !unvisitedUrls.includes(item)) {
                unvisitedUrls.push(item);
            }
        });
        const nextUrl = unvisitedUrls.pop();
        visitedUrls.push(nextUrl);
        await run(nextUrl, selector)
    } catch (error) {
        console.log(error.message);
    }
    browser.close();
}
run(domain, selector);