const Axios = require('axios')
const Cheerio = require('cheerio')

/**
 * A simple method to crawl a web page using Cheerio
 * 
 * Returns the data of the provided selector.
 * 
 * Ex: inputs( htmlString, selector ) ==> outputs( [string of matched content] )
 */
const crawlPage = (content, selector) => {
    const $ = Cheerio.load(content)
    const selected = $(selector)
    
    const text = selected.text()
    const html = selected.html()

    // console.log(selector, text, html)
    return text
    
    return {
        selector,
        html,
        text
    }
}

/**
 * Given a URL (url), parse the specified set of selectors (selectorsMaps) each with their own label
 * 
 * Ex:
 *     inputs( URL, selectorsMap )
 *         selectorsMap = {
 *            'rank': '#prodDetails #SalesRank > td.value',
 *            'dimensions': '#prodDetails tr.size-weight > td.value',
 *            'price': '.priceblock_ourprice',
 *            'category': 'span.cat-link'
 *         }
 */
const parsePage = (url, selectorsMap) => {
    return Axios
        .get(url)
        .then(response => response.data)
        .then((htmlContent) => {
            const crawlTasks = []
            const selectorKeys = Object.keys(selectorsMap)

            // for each selector, create a crawl task Promise and add it to list
            selectorKeys.forEach((selectorKey) => {
                crawlTasks.push(crawlPage(htmlContent, selectorsMap[selectorKey]))
            })

            return Promise
                .all(crawlTasks)
                .then((results) => {
                    // zip the labels (selectorKeys) and values (results) together
                    const zipped = {}
                    selectorKeys.forEach((key, index) => zipped[key] = results[index])
                    return zipped
                })
        })
}

const searchAmazonByASIN = (asin, baseUrl = 'https://www.amazon.com/dp') => {
    if (!asin) {
        throw new Error('ASIN number is required for search')
    }

    const searchUrl = `${baseUrl}/${asin}`

    console.log(`Searching URL: ${searchUrl}`)
    
    return parsePage(searchUrl, {
        'rank': '#prodDetails #SalesRank > td.value',
        'dimensions': '#prodDetails tr.size-weight:nth-child(2) > td.value',
        'price': '.priceblock_ourprice',
        'category': 'span.cat-link'
    })
}

module.exports = {
    searchAmazonByASIN,
    crawlPage,
    parsePage,
}