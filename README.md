# Amazon ASIN Search


## Getting Started

### Dependencies

1. Redis
2. NodeJS (npm or yarn)
3. ___(optional)___ Docker & Docker Compose

### Running the App

To run the app, simply make sure that all npm modules are installed with `yarn install` and then run the app in dev mode with `yarn run dev`.

Alternatively, use npm with `npm install` and `node ./server.js`.

If you would like to use Docker, there is a docker compose file which will spin up the app and a Redis (no user/auth) instance along with it. The default configuration uses `redis` as a host path for the Redis instance, this named host comes from the docker-compose image name. Change `./config.js` if you would like to setup a different host for Redis.


## Architecture 

__NOTE:__ The fastest approach to getting proruct details from Amazon would be to use the official SDK. This repo however, will take the approach of scraping the page as an alternative.



### Simple approach

This is the approach taken in this repo, however other techniques and improvements will be discussed in this README.

__Searching__

The search starts by turing the ASIN identifier into a URL. 

The product page is then fetched for the HTML to be parsed next.

When parsing the HTML, an NPM package, Cheerio, was utilized for quering the DOM of the page.


__Stack__

* NodeJS server with ExpressJS (basic HTTP framework)
* Redis DB to cache ASIN details
* Cheerio for HTML parsing and quering


__Challenges__

1. __Parsing__ the page are related to Amazon's dynamic product pages. Classes, IDs and HTML nodes are not consistent across pages. The simplest solution for this using multiple selectors for each field such as `Best Seller Rank` as well as using text matching with the selectors, for example `th:contains("Best Seller Rank")`.

2. __Scaling__ the solution to work for thousands of users sumiltaneously would need more tools (described in the Improved/Scalable Approach section below). In short, we would need to use a queue to process all sumiltaneous requrests, as well as potentially employing horizontal scaling where multiple instances of the server are fetching queued requests from a single queue.

3. __Caching__ the results into a Redis instance is ok initially but will need to be replaced with a long-term storage solution such Postgres (more on this below).


![](https://lh3.googleusercontent.com/setqDBlAMdMkhtFA0b6sj3SQ6U24P2UZ5f0DibypzuGJhBnbvaY32TL9u-oVEV6KArG0dbR-atBqJ3ZxfwIl=w1280-h701-rw)

![](https://lh6.googleusercontent.com/mz6vvJgbXb5Tio_omwIHCulP7wYcx_ycBFPX86BcmoxpLlupuiPDcpIk7iRg_dw3WPB7DhM-CjghiFcZd_5O=w1280-h701-rw)


### Improved Approach

This improved approach builds on the previous one but is more tuned for scalability. 

__Stack__

* NodeJS server with ExpressJS (basic HTTP framework)
* Potentially seperatate the UI with ReactJS (introduces more flexibility on the Front-end)
* Redis DB as queue for processing new search requests
* Cheerio for HTML parsing and quering (if the condition of not using the SDK is still imposed)
* Postgres for permanently storing search results, used as a cache

__Other Improvements__

Instead of pre-specifying selectors for parsing the page, data mining techniques could be utilized to deal with dynamic page structure and element atrributes.

For example, instead of looking for an element matching the selectors `th:contains("Best Seller Rank") + td` and `li:contains("Best Seller Rank")`, we can build a more generic algorithm which works regardless of HTML structure beings parsed, `findContent("Best Seller Rank")` which works for both `th` and `li` elements.

In general terms, we can view the page for its actual content rather than how the page looks. This can be done with Machine Learning and Data Mining techniques.

![](https://lh4.googleusercontent.com/f-idm61Nrf7sDFvLSq3NFC9QEdCIE6Q1FQCsXJG0CET82be9KTnA0zOURIl20-1yvVYv1ssa8V54rvh_ILIO=w1042-h668-rw)


__Yet Another Approach__

You could also create a scalable approach without introducing complexity of a Redis queue. If each client (front-end/browser) searches and parses the pages it's looking for then sends the results to the backend. You could arrive to the same result.

The UI can check with the API before starting to parse the page if the specific ASIN exists in the cached the results.

In this way, the backend simply becomes a caching mechanism across the different clients, but the work of the actual parsing is offsetted to the browser.

![](https://lh6.googleusercontent.com/Z7ZPbqcBpj0knBGmncHKOykhwHtde-v3USmpCiWtuspChpbUziMSzn7_2vkz8NkeuveqGGDN1Atz_SASIhXj=w1042-h668-rw)

