var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

app.get('/scrape', function(req, res) {

  url = 'http://www.self-help-and-self-development.com/affirmations.html';

  request(url, function(error, response, html) {

    if (!error) {

      var $ = cheerio.load(html),
          category,
          affText;

      var json = {
        categories : []
      }

      $('.columns_block li').filter(function() {

        var data = $(this);
        
        data.each(function(key, value) {
          json.categories.push($(data[key]).find('b').text());
        });

      });

    } else {
      console.log(error);
    }

    fs.writeFile('seeds.json', JSON.stringify(json, null, 4), function(err) {
      console.log('File successfully written.')
    });

    res.send('Scraping Complete.');

  });

});



app.listen('8081')
console.log('Magic happens on port 8081');

exports = module.exports = app;
