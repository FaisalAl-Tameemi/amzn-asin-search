const express = require('express')
const expressPromise = require('express-promise')
const bodyParser = require('body-parser')
const compression = require('compression')

const config = require('./config')
const logger = require('./logger.util')
const crawler = require('./crawler.util')

const app = express()

app.set('view engine', 'ejs')

// ---- MIDDLEWARE ----

app.use(bodyParser.urlencoded({ extended: true }))
app.use(compression())
app.use(bodyParser.json())
app.use(expressPromise())
app.use(express.static('public'))

// ---- ROUTES ----

app.get('/', (_, res) => res.render('home'))

app.get('/search', (req, res) => {
    if (!req.query.asin) {
        return res.render('search', {
            error: 'Invalid or missing ASIN identifier'
        })
    }

    // TODO: check if product has already been fetched before
    return crawler
        .searchAmazonByASIN(req.query.asin)
        .then((results) => {
            if (!results) {
                console.log('No product found for given ASIN')
                return res.render('search', {
                    error: 'No product found',
                    asin: req.query.asin
                })
            }

            const { dimensions, category, rank } = results

            console.log(`Dimensions: ${dimensions}`)
            console.log(`Category: ${category}`)
            console.log(`Rank: ${rank}`)
            
            return res.render('search', {
                asin: req.query.asin,
                product: results,
            })
        })
        .catch((err) => {
            console.error(err)
            return res.render('search', {
                error: 'Failed to fetch results, check system logs'
            })
        })
})

// ---- INIT ----

app.listen(config.port)

logger.info(`Running in '${config.env}' environment`)
logger.info(`Application is now running on port ${config.port}`)