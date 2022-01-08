const { ifError } = require('assert')
const axios = require('axios')
const cheerio = require('cheerio')
const express = require('express')

//https://coinmarketcap.com/

async function getPriceFeed() {
  try {
    const siteurl = 'https://coinmarketcap.com/'
    const { data } = await axios({
      method: "GET",
      url: siteurl,
    })
    const $ = cheerio.load(data)
    const element = '#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div:nth-child(1) > div.h7vnx2-1.bFzXgL > table > tbody > tr'

    const keys = [
      'rank',
      'name',
      'price',
      '24h',
      '7d',
      'marketCap',
      'volume',
      'circulatingSupply'
    ]

    const coinArr = []

    $(element).each((parentidx, parentelement) => {
      let keyidx = 0
      const coinobj = {}
      if (parentidx < 10) {
        $(parentelement).children().each((childidx, childelement) => {
          let tdvalue = $(childelement).text()
          if (keyidx === 1 || keyidx === 6) {
            tdvalue = $('p:first-child', $(childelement).html()).text()
          }
          if (tdvalue) {
            coinobj[keys[keyidx++]] = tdvalue
          }
        })
        coinArr.push(coinobj)
      }
    })
    return coinArr
  } catch (err) {
    console.err(err)
  }
}

const app = express()
app.get('/api/price-feed', async (req, res) => {
  try {
    const priceFeed = await getPriceFeed()
    return res.status(200).json({
      result: priceFeed,
    })
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    })
  }
})

app.listen(3000, () => {
  console.log("running port 3000")
}) 