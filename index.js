var request = require("request");
var cheerio = require("cheerio");
var nodemailer = require('nodemailer');

var crypto = function() {
    request({
      url: "https://coinmarketcap.com/",
      method: "GET"
    }, function(error, response, body) {
      if (error || !body) {
        return;
      }else{
        var $ = cheerio.load(body);
        const target = $("tbody tr td");
        const coinType=target.find('.sc-1teo54s-2.fZIJcI p');
        const cointPrice=target.find('a.cmc-link');
        console.log(coinType.eq(0).text());
        console.log(cointPrice.eq(0).text().substr(1));
      }
    });
  };


crypto();
// setInterval(crypto,5000);