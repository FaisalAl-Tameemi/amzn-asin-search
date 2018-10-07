# Amazon ASIN Search



## Architecture 

__NOTE:__ The simplest approach to getting proruct details from Amazon would be to use the official SDK. This repo however, will take the approach of scraping the page.



### Simple approach

This is the approach taken in this repo, however other techniques and improvements will be discussed in this README.

__Searching__

The search starts by turing the ASIN identifier into a URL. 

The product page is then fetched for the HTML to be parsed next.

When parsing the HTML, a tool for quering the DOM of the page, Cheerio is used in this repo for that task.

> __Challenges__ with parsing the page are related to Amazon's dynamic product pages. Classes, IDs and HTML nodes are not consistent across pages.
The simplest solution for this using multiple selectors for each field such as `Best Seller Rank` as well as using text matching with the selectors, for example `th:contains("Best Seller Rank")`.



> __TODO__:
Discuss stack (expressjs, redis, ...)



### Imrpoved/Scalable Approach

...

> __TODO__:
Discuss stack (postgres, redis, node, react)



## Screenshots

...
